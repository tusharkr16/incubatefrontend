'use client';
import { useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  FileText, Upload, CheckCircle, ExternalLink,
  RefreshCw, AlertCircle, File, ImageIcon, Presentation,
} from 'lucide-react';

// ── helpers ────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mime: string) {
  if (mime?.includes('pdf')) return <FileText size={20} className="text-red-400" />;
  if (mime?.includes('image')) return <ImageIcon size={20} className="text-blue-400" />;
  return <Presentation size={20} className="text-orange-400" />;
}

function fileTypeLabel(mime: string) {
  if (mime?.includes('pdf')) return 'PDF';
  if (mime?.includes('png')) return 'PNG';
  if (mime?.includes('jpeg') || mime?.includes('jpg')) return 'JPG';
  if (mime?.includes('webp')) return 'WEBP';
  if (mime?.includes('presentationml')) return 'PPTX';
  if (mime?.includes('powerpoint')) return 'PPT';
  return 'FILE';
}

// ── page ────────────────────────────────────────────────────────────────────
export default function FounderDocumentsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // 1. Get the linked startup
  const { data: startup } = useQuery({
    queryKey: ['my-startup', user?._id],
    queryFn: () => apiClient.get('/founders/my/startup').then((r) => r.data),
    enabled: !!user?._id,
  });

  // 2. Get pitch_deck documents for this startup
  const { data: docs = [], isLoading: docsLoading } = useQuery({
    queryKey: ['documents', startup?._id, 'pitch_deck'],
    queryFn: () =>
      apiClient
        .get(`/documents/startup/${startup._id}`, { params: { type: 'pitch_deck' } })
        .then((r) => r.data),
    enabled: !!startup?._id,
  });

  const pitchDeck = docs[0] ?? null; // latest pitch deck

  // 3. Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startupId', startup._id);
      formData.append('type', 'pitch_deck');
      formData.append('description', 'Pitch Deck');

      setUploadProgress(0);
      const { data } = await apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', startup?._id, 'pitch_deck'] });
      setUploadProgress(0);
      setUploadError('');
    },
    onError: (err: any) => {
      setUploadError(err?.response?.data?.message ?? 'Upload failed. Please try again.');
      setUploadProgress(0);
    },
  });

  // 4. Drag-and-drop handlers
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) pickFile(file);
    },
    [startup],
  );

  function pickFile(file: File) {
    setUploadError('');
    const MAX = 20 * 1024 * 1024;
    if (file.size > MAX) {
      setUploadError('File is too large. Maximum size is 20 MB.');
      return;
    }
    uploadMutation.mutate(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) pickFile(file);
    e.target.value = '';
  }

  if (!startup) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
            <p className="text-slate-500 text-sm mt-1">Upload and manage your startup documents</p>
          </div>
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No startup linked to your account yet.</p>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const isUploading = uploadMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-500 text-sm mt-1">{startup.name} · Pitch deck & files</p>
        </div>

        {/* Pitch Deck Section */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Pitch Deck
          </h2>

          {pitchDeck ? (
            /* ── Existing pitch deck card ── */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Preview panel */}
              <div className="lg:col-span-3">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle>Current Pitch Deck</CardTitle>
                    {pitchDeck.isVerified ? (
                      <Badge variant="success">
                        <CheckCircle size={11} className="mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning">Pending review</Badge>
                    )}
                  </div>

                  {/* One-page pitch deck preview */}
                  <div className="relative w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                    style={{ aspectRatio: '16/9' }}>
                    {pitchDeck.mimeType?.includes('pdf') ? (
                      <iframe
                        src={`${pitchDeck.url}#toolbar=0&navpanes=0`}
                        className="w-full h-full"
                        title="Pitch Deck Preview"
                      />
                    ) : pitchDeck.mimeType?.includes('image') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pitchDeck.url}
                        alt="Pitch Deck"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <Presentation size={40} className="text-slate-300" />
                        <p className="text-slate-400 text-sm">
                          Preview not available for {fileTypeLabel(pitchDeck.mimeType)}
                        </p>
                        <a
                          href={pitchDeck.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 text-sm hover:underline font-medium"
                        >
                          Open file
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4">
                    <a href={pitchDeck.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm">
                        <ExternalLink size={13} className="mr-1.5" /> Open in new tab
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileRef.current?.click()}
                      loading={isUploading}
                    >
                      <RefreshCw size={13} className="mr-1.5" /> Replace
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Metadata panel */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader><CardTitle>File Details</CardTitle></CardHeader>
                  <dl className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                        {fileIcon(pitchDeck.mimeType)}
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs text-slate-400 mb-0.5">Filename</dt>
                        <dd className="text-sm font-medium text-slate-800 truncate">
                          {pitchDeck.filename}
                        </dd>
                      </div>
                    </div>

                    <Row label="Type">{fileTypeLabel(pitchDeck.mimeType)}</Row>
                    <Row label="Size">{formatBytes(pitchDeck.sizeBytes)}</Row>
                    <Row label="Uploaded">
                      {new Date(pitchDeck.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </Row>
                    <Row label="Status">
                      {pitchDeck.isVerified ? (
                        <span className="text-emerald-600 font-medium">Verified</span>
                      ) : (
                        <span className="text-amber-500 font-medium">Awaiting review</span>
                      )}
                    </Row>
                  </dl>
                </Card>

                {/* Upload another version */}
                <DropZone
                  compact
                  dragging={false}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  error=""
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  label="Upload new version"
                />
              </div>
            </div>
          ) : (
            /* ── No pitch deck yet — full upload zone ── */
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <File size={18} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Upload your Pitch Deck</h3>
                  <p className="text-sm text-slate-500">
                    Your pitch deck will be reviewed by the incubator team
                  </p>
                </div>
              </div>

              <DropZone
                dragging={dragging}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={uploadError}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              />
            </Card>
          )}

          {/* Show upload error when pitch deck exists */}
          {pitchDeck && uploadError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              <AlertCircle size={14} className="flex-shrink-0" />
              {uploadError}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.ppt,.pptx"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* Coming soon: other doc types */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Other Documents
          </h2>
          <Card>
            <div className="text-center py-10">
              <FileText size={28} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                Financials, incorporation docs, and compliance certificates
              </p>
              <p className="text-slate-300 text-xs mt-1">Coming soon</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ── sub-components ──────────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-slate-400 mb-0.5">{label}</dt>
      <dd className="text-sm text-slate-800">{children}</dd>
    </div>
  );
}

interface DropZoneProps {
  dragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string;
  compact?: boolean;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragEnter: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onClick: () => void;
  label?: string;
}

function DropZone({
  dragging, isUploading, uploadProgress, error,
  onDragOver, onDragEnter, onDragLeave, onDrop, onClick,
  compact = false, label = 'Drop your pitch deck here',
}: DropZoneProps) {
  return (
    <div>
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={!isUploading ? onClick : undefined}
        className={[
          'relative rounded-xl border-2 border-dashed transition-all cursor-pointer select-none',
          compact ? 'p-5' : 'p-12',
          dragging
            ? 'border-violet-400 bg-violet-50'
            : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/40',
          isUploading ? 'pointer-events-none opacity-70' : '',
        ].join(' ')}
      >
        {isUploading ? (
          /* Progress state */
          <div className={compact ? 'text-center' : 'text-center'}>
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3">
              <Upload size={18} className="text-violet-600 animate-bounce" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-3">Uploading…</p>
            <div className="w-full max-w-xs mx-auto">
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 text-right">{uploadProgress}%</p>
            </div>
          </div>
        ) : compact ? (
          /* Compact state (replace version) */
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Upload size={14} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400">PDF, PPT, or image · max 20 MB</p>
            </div>
          </div>
        ) : (
          /* Full drop zone */
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5">
              <Upload size={26} className="text-violet-500" />
            </div>
            <p className="text-base font-semibold text-slate-800 mb-1">{label}</p>
            <p className="text-sm text-slate-400 mb-5">or click to browse from your computer</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['PDF', 'PPT', 'PPTX', 'JPG', 'PNG'].map((ext) => (
                <span
                  key={ext}
                  className="text-xs font-medium text-slate-500 bg-slate-100 rounded-md px-2.5 py-1"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-300 mt-3">Maximum file size: 20 MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
