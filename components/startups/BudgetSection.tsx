'use client';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '@/lib/api';
import {
  ChevronDown, ChevronRight, Edit2, X, Upload, FileText,
  ExternalLink, Trash2, Plus, IndianRupee, TrendingUp, TrendingDown,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import { clsx } from 'clsx';

// ── fixed item definitions ────────────────────────────────────────────────────

type BudgetCategory = 'recurring' | 'training' | 'administrative' | 'travel' | 'capax';

interface FixedItem {
  id: string;
  category: BudgetCategory;
  year: number;
  description: string;
}

const FIXED_ITEMS: FixedItem[] = [
  { id: '1',  category: 'recurring',       year: 1, description: 'Digital Marketing and publicity on digital media' },
  { id: '2',  category: 'recurring',       year: 1, description: 'Networking events and activities' },
  { id: '3',  category: 'recurring',       year: 2, description: 'Digital Marketing and publicity on digital media' },
  { id: '4',  category: 'recurring',       year: 2, description: 'Networking events and activities' },
  { id: '5',  category: 'recurring',       year: 3, description: 'Digital Marketing and publicity on digital media' },
  { id: '6',  category: 'recurring',       year: 3, description: 'Networking events and activities' },
  { id: '7',  category: 'training',        year: 1, description: 'Training programs for budding entrepreneurs' },
  { id: '8',  category: 'training',        year: 1, description: 'Fund raise and business growth events for startups' },
  { id: '9',  category: 'training',        year: 1, description: 'Honorarium to Mentors / Domain experts' },
  { id: '10', category: 'training',        year: 2, description: 'Training programs for budding entrepreneurs' },
  { id: '11', category: 'training',        year: 2, description: 'Fund raise and business growth events for startups' },
  { id: '12', category: 'training',        year: 2, description: 'Honorarium to Mentors / Domain experts' },
  { id: '13', category: 'training',        year: 3, description: 'Training programs for budding entrepreneurs' },
  { id: '14', category: 'training',        year: 3, description: 'Fund raise and business growth events for startups' },
  { id: '15', category: 'training',        year: 3, description: 'Honorarium to Mentors / Domain experts' },
  { id: '16', category: 'administrative',  year: 1, description: 'Consumables for labs, printing material, stationery, etc.' },
  { id: '17', category: 'administrative',  year: 1, description: 'Publication in digital and hardcopy' },
  { id: '18', category: 'administrative',  year: 1, description: 'Miscellaneous expenses' },
  { id: '19', category: 'administrative',  year: 2, description: 'Consumables for labs, printing material, stationery, etc.' },
  { id: '20', category: 'administrative',  year: 2, description: 'Publication in digital and hardcopy' },
  { id: '21', category: 'administrative',  year: 3, description: 'Consumables for labs, printing material, stationery, etc.' },
  { id: '22', category: 'administrative',  year: 3, description: 'Publication in digital and hardcopy' },
  { id: '23', category: 'travel',          year: 1, description: 'Domestic Travel' },
  { id: '24', category: 'travel',          year: 2, description: 'Domestic Travel' },
  { id: '25', category: 'travel',          year: 3, description: 'Domestic Travel' },
];

const CATEGORY_META: Record<BudgetCategory, { label: string; color: string; bg: string; border: string }> = {
  recurring:      { label: 'Recurring – Marketing, Networking, Publicity, Portal & Website', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  training:       { label: 'Training Costs',                                                  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  administrative: { label: 'Other Administrative Expenses',                                   color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  travel:         { label: 'Travel (Domestic)',                                               color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  capax:          { label: 'CAPAX (Capital Expenditure)',                                     color: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200' },
};

const CATEGORIES: BudgetCategory[] = ['recurring', 'training', 'administrative', 'travel', 'capax'];

// ── helpers ───────────────────────────────────────────────────────────────────

function inr(n: number) {
  if (!n) return '₹0';
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ── types ─────────────────────────────────────────────────────────────────────

interface BudgetEntry {
  _id?: string;
  itemKey: string;
  category: BudgetCategory;
  year: number;
  description: string;
  budgetAmount: number;
  spentAmount: number;
  comment: string;
  invoiceUrl: string;
  invoiceFileName: string;
}

interface EditState {
  budgetAmount: string;
  spentAmount: string;
  comment: string;
}

// ── sub-components ────────────────────────────────────────────────────────────

function YearBadge({ year }: { year: number }) {
  if (!year) return null;
  const cls = ['', 'bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700'][year] ?? 'bg-slate-100 text-slate-600';
  return <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap', cls)}>Y{year}</span>;
}

// ── edit modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
  entry: BudgetEntry;
  startupId: string;
  onClose: () => void;
}

function EditModal({ entry, startupId, onClose }: EditModalProps) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditState>({
    budgetAmount: entry.budgetAmount ? String(entry.budgetAmount) : '',
    spentAmount: entry.spentAmount ? String(entry.spentAmount) : '',
    comment: entry.comment ?? '',
  });
  const [uploading, setUploading] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const upsertMutation = useMutation({
    mutationFn: (data: Partial<BudgetEntry>) =>
      budgetApi.upsert(startupId, entry.itemKey, {
        category: entry.category,
        year: entry.year,
        description: entry.description,
        budgetAmount: Number(form.budgetAmount) || 0,
        spentAmount: Number(form.spentAmount) || 0,
        comment: form.comment,
        ...data,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budget', startupId] });
      onClose();
    },
    onError: (e: any) => setSaveErr(e?.response?.data?.message ?? 'Save failed'),
  });

  const removeInvoiceMutation = useMutation({
    mutationFn: () => budgetApi.removeInvoice(startupId, entry.itemKey),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget', startupId] }),
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setSaveErr('');
    try {
      const b64 = await toBase64(file);
      await budgetApi.uploadInvoice(startupId, entry.itemKey, b64, file.name);
      qc.invalidateQueries({ queryKey: ['budget', startupId] });
    } catch (err: any) {
      setSaveErr(err?.response?.data?.message ?? 'Invoice upload failed');
    } finally {
      setUploading(false);
    }
  }

  const f = (k: keyof EditState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition';

  const balance = (Number(form.budgetAmount) || 0) - (Number(form.spentAmount) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <YearBadge year={entry.year} />
              <span className="text-xs text-slate-400 uppercase tracking-wide">{CATEGORY_META[entry.category]?.label.split('–')[0].trim()}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-snug">{entry.description}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Budget + Spent */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Total Budget (₹)</label>
              <input
                className={inputCls}
                type="number"
                min={0}
                placeholder="0"
                value={form.budgetAmount}
                onChange={f('budgetAmount')}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Amount Spent (₹)</label>
              <input
                className={inputCls}
                type="number"
                min={0}
                placeholder="0"
                value={form.spentAmount}
                onChange={f('spentAmount')}
              />
            </div>
          </div>

          {/* Balance indicator */}
          {(form.budgetAmount || form.spentAmount) && (
            <div className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
              balance >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600',
            )}>
              {balance >= 0
                ? <TrendingUp size={14} />
                : <TrendingDown size={14} />}
              Balance: {inr(Math.abs(balance))} {balance < 0 ? '(over budget)' : 'remaining'}
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="text-xs text-slate-500 font-medium block mb-1">Notes / Comment</label>
            <textarea
              className={clsx(inputCls, 'resize-none')}
              rows={3}
              placeholder="Add any notes, justifications, or remarks…"
              value={form.comment}
              onChange={f('comment')}
            />
          </div>

          {/* Invoice */}
          <div>
            <label className="text-xs text-slate-500 font-medium block mb-2">Invoice / Supporting Document</label>
            {entry.invoiceUrl ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <FileText size={16} className="text-violet-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 truncate flex-1">{entry.invoiceFileName || 'Uploaded document'}</span>
                <a href={entry.invoiceUrl} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-500 flex-shrink-0">
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={() => removeInvoiceMutation.mutate()}
                  disabled={removeInvoiceMutation.isPending}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-sm text-slate-500 hover:text-violet-600 transition-colors">
                <Upload size={15} />
                {uploading ? 'Uploading…' : 'Upload invoice or document (PDF, image)'}
              </button>
            )}
            <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {saveErr && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{saveErr}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition">
            Cancel
          </button>
          <button
            onClick={() => upsertMutation.mutate({})}
            disabled={upsertMutation.isPending}
            className="px-5 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50">
            {upsertMutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CAPAX add-row modal ───────────────────────────────────────────────────────

interface AddCapaxModalProps {
  startupId: string;
  onClose: () => void;
}

function AddCapaxModal({ startupId, onClose }: AddCapaxModalProps) {
  const qc = useQueryClient();
  const [desc, setDesc] = useState('');
  const [err, setErr] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      budgetApi.upsert(startupId, `capax_${Date.now()}`, {
        category: 'capax',
        year: 0,
        description: desc.trim(),
        budgetAmount: 0,
        spentAmount: 0,
        comment: '',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budget', startupId] });
      onClose();
    },
    onError: (e: any) => setErr(e?.response?.data?.message ?? 'Failed to add item'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-800 mb-4">Add CAPAX Line Item</h3>
        <label className="text-xs text-slate-500 font-medium block mb-1">Description</label>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="e.g. Lab Equipment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          autoFocus
        />
        {err && <p className="text-xs text-red-500 mb-3">{err}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition">Cancel</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!desc.trim() || mutation.isPending}
            className="px-5 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50">
            {mutation.isPending ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── row component ─────────────────────────────────────────────────────────────

interface RowProps {
  seq: number;
  entry: BudgetEntry;
  startupId: string;
  onEdit: (entry: BudgetEntry) => void;
  isCapax?: boolean;
}

function BudgetRow({ seq, entry, startupId, onEdit, isCapax }: RowProps) {
  const qc = useQueryClient();
  const balance = (entry.budgetAmount || 0) - (entry.spentAmount || 0);
  const hasData = entry.budgetAmount > 0 || entry.spentAmount > 0;
  const overBudget = entry.budgetAmount > 0 && balance < 0;

  const deleteMutation = useMutation({
    mutationFn: () => budgetApi.deleteEntry(startupId, entry.itemKey),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budget', startupId] }),
  });

  return (
    <tr className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <td className="py-3 pl-4 pr-2 text-xs text-slate-400 font-mono w-8">{seq}</td>
      <td className="py-3 px-2 w-12">
        {entry.year > 0 && <YearBadge year={entry.year} />}
      </td>
      <td className="py-3 px-2 text-sm text-slate-700 leading-snug">{entry.description}</td>
      <td className="py-3 px-3 text-right font-medium text-sm text-slate-800 tabular-nums w-28">
        {entry.budgetAmount > 0 ? inr(entry.budgetAmount) : <span className="text-slate-300">—</span>}
      </td>
      <td className="py-3 px-3 text-right font-medium text-sm tabular-nums w-28">
        <span className={entry.spentAmount > 0 ? 'text-slate-800' : 'text-slate-300'}>
          {entry.spentAmount > 0 ? inr(entry.spentAmount) : '—'}
        </span>
      </td>
      <td className="py-3 px-3 text-right text-sm tabular-nums w-28">
        {hasData ? (
          <span className={clsx('font-semibold', overBudget ? 'text-red-500' : 'text-emerald-600')}>
            {overBudget ? '-' : ''}{inr(Math.abs(balance))}
          </span>
        ) : <span className="text-slate-300">—</span>}
      </td>
      <td className="py-3 px-3 w-16">
        <div className="flex items-center gap-1 justify-center">
          {entry.comment ? (
            <button
              title={entry.comment}
              onClick={() => onEdit(entry)}
              className="p-1 rounded text-slate-400 hover:text-violet-600"
            >
              <CheckCircle size={13} className="text-emerald-500" />
            </button>
          ) : null}
          {entry.invoiceUrl && (
            <a href={entry.invoiceUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 rounded text-slate-400 hover:text-violet-600">
              <FileText size={13} className="text-blue-400" />
            </a>
          )}
          {overBudget && <AlertCircle size={13} className="text-red-400" />}
        </div>
      </td>
      <td className="py-3 pr-4 pl-2 w-20">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg hover:bg-violet-100 text-slate-400 hover:text-violet-600 transition"
            title="Edit"
          >
            <Edit2 size={12} />
          </button>
          {isCapax && (
            <button
              onClick={() => { if (confirm('Delete this item?')) deleteMutation.mutate(); }}
              className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── category section ──────────────────────────────────────────────────────────

interface CategorySectionProps {
  category: BudgetCategory;
  rows: BudgetEntry[];
  seqStart: number;
  startupId: string;
  onEdit: (entry: BudgetEntry) => void;
  onAddCapax?: () => void;
}

function CategorySection({ category, rows, seqStart, startupId, onEdit, onAddCapax }: CategorySectionProps) {
  const [open, setOpen] = useState(true);
  const meta = CATEGORY_META[category];
  const totalBudget = rows.reduce((s, r) => s + (r.budgetAmount || 0), 0);
  const totalSpent = rows.reduce((s, r) => s + (r.spentAmount || 0), 0);
  const balance = totalBudget - totalSpent;

  return (
    <div className={clsx('rounded-xl border overflow-hidden', meta.border)}>
      {/* Category header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx('w-full flex items-center gap-3 px-4 py-3 text-left', meta.bg)}
      >
        <span className="flex-shrink-0 text-slate-400">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <span className={clsx('text-sm font-bold flex-1', meta.color)}>{meta.label}</span>
        {totalBudget > 0 && (
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-500">Budget: <span className="font-bold text-slate-700">{inr(totalBudget)}</span></span>
            <span className="text-slate-500">Spent: <span className="font-bold text-slate-700">{inr(totalSpent)}</span></span>
            <span className={clsx('font-bold', balance < 0 ? 'text-red-500' : 'text-emerald-600')}>
              {balance < 0 ? '-' : ''}{inr(Math.abs(balance))}
            </span>
          </div>
        )}
      </button>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-2 pl-4 pr-2 text-xs text-slate-400 font-semibold w-8">#</th>
                <th className="py-2 px-2 text-xs text-slate-400 font-semibold w-12">Year</th>
                <th className="py-2 px-2 text-xs text-slate-400 font-semibold">Description</th>
                <th className="py-2 px-3 text-xs text-slate-400 font-semibold text-right w-28">Budget</th>
                <th className="py-2 px-3 text-xs text-slate-400 font-semibold text-right w-28">Spent</th>
                <th className="py-2 px-3 text-xs text-slate-400 font-semibold text-right w-28">Balance</th>
                <th className="py-2 px-3 text-xs text-slate-400 font-semibold w-16 text-center">Docs</th>
                <th className="py-2 pr-4 w-20" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <BudgetRow
                  key={row.itemKey}
                  seq={seqStart + i}
                  entry={row}
                  startupId={startupId}
                  onEdit={onEdit}
                  isCapax={category === 'capax'}
                />
              ))}
            </tbody>
          </table>

          {/* CAPAX: add row button */}
          {category === 'capax' && (
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={onAddCapax}
                className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium hover:bg-violet-50 px-3 py-1.5 rounded-lg transition"
              >
                <Plus size={14} /> Add CAPAX Item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

interface BudgetSectionProps {
  startupId: string;
}

export function BudgetSection({ startupId }: BudgetSectionProps) {
  const [editEntry, setEditEntry] = useState<BudgetEntry | null>(null);
  const [addCapax, setAddCapax] = useState(false);

  const { data: dbEntries = [], isLoading } = useQuery<BudgetEntry[]>({
    queryKey: ['budget', startupId],
    queryFn: () => budgetApi.getByStartup(startupId).then((r) => r.data),
    enabled: !!startupId,
  });

  // Merge fixed items with DB data
  const entryMap = new Map(dbEntries.map((e) => [e.itemKey, e]));

  function mergedEntry(item: FixedItem): BudgetEntry {
    const db = entryMap.get(item.id);
    return {
      itemKey: item.id,
      category: item.category,
      year: item.year,
      description: item.description,
      budgetAmount: db?.budgetAmount ?? 0,
      spentAmount: db?.spentAmount ?? 0,
      comment: db?.comment ?? '',
      invoiceUrl: db?.invoiceUrl ?? '',
      invoiceFileName: db?.invoiceFileName ?? '',
    };
  }

  const capaxEntries = dbEntries.filter((e) => e.category === 'capax');

  // Summary totals
  const allRows = [
    ...FIXED_ITEMS.map(mergedEntry),
    ...capaxEntries,
  ];
  const grandBudget = allRows.reduce((s, r) => s + (r.budgetAmount || 0), 0);
  const grandSpent = allRows.reduce((s, r) => s + (r.spentAmount || 0), 0);
  const grandBalance = grandBudget - grandSpent;

  // Group items by category
  function rowsFor(cat: BudgetCategory): BudgetEntry[] {
    if (cat === 'capax') return capaxEntries;
    return FIXED_ITEMS.filter((i) => i.category === cat).map(mergedEntry);
  }

  // Sequential numbering
  function seqStartFor(cat: BudgetCategory): number {
    const cats: BudgetCategory[] = ['recurring', 'training', 'administrative', 'travel', 'capax'];
    let seq = 1;
    for (const c of cats) {
      if (c === cat) return seq;
      seq += rowsFor(c).length;
    }
    return seq;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1"><IndianRupee size={11} /> Total Budget</p>
          <p className="text-xl font-black text-slate-800">{inr(grandBudget)}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1"><TrendingDown size={11} /> Total Spent</p>
          <p className="text-xl font-black text-slate-800">{inr(grandSpent)}</p>
        </div>
        <div className={clsx('border rounded-xl p-4 text-center shadow-sm', grandBalance < 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100')}>
          <p className={clsx('text-xs mb-1 flex items-center justify-center gap-1', grandBalance < 0 ? 'text-red-400' : 'text-emerald-600')}>
            {grandBalance < 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />} Balance
          </p>
          <p className={clsx('text-xl font-black', grandBalance < 0 ? 'text-red-600' : 'text-emerald-700')}>
            {grandBalance < 0 ? '-' : ''}{inr(Math.abs(grandBalance))}
          </p>
        </div>
      </div>

      {/* Category sections */}
      {CATEGORIES.map((cat) => (
        <CategorySection
          key={cat}
          category={cat}
          rows={rowsFor(cat)}
          seqStart={seqStartFor(cat)}
          startupId={startupId}
          onEdit={setEditEntry}
          onAddCapax={cat === 'capax' ? () => setAddCapax(true) : undefined}
        />
      ))}

      {/* Modals */}
      {editEntry && (
        <EditModal
          entry={editEntry}
          startupId={startupId}
          onClose={() => setEditEntry(null)}
        />
      )}
      {addCapax && (
        <AddCapaxModal
          startupId={startupId}
          onClose={() => setAddCapax(false)}
        />
      )}
    </div>
  );
}
