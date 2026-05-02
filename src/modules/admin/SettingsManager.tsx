import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const SettingsManager = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 1MB" });
      return;
    }

    if (file.type !== "image/png" && file.type !== "image/svg+xml") {
      setMessage({ type: "error", text: "Only PNG and SVG files are allowed" });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMessage(null);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append("logo", file);

      const res = await fetch("/api/admin/logo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload logo");
      }

      setMessage({ type: "success", text: "Logo updated successfully! Refresh the page to see changes." });
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-6">Branding Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Platform Logo</label>
            <p className="text-xs text-gray-500 mb-4">Upload a PNG or SVG file (max 1MB). This will replace the logo across the entire platform.</p>
            
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden p-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <img alt="Current IFX Trades logo" src="/uploads/logo/logo.png" onError={(e) => e.currentTarget.src = "/logo.png"} className="max-w-full max-h-full object-contain" />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/svg+xml"
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-white/5 file:text-white hover:file:bg-white/10 transition-all"
                />
                
                <button 
                  onClick={handleUpload}
                  disabled={uploading || !previewUrl}
                  className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Logo
                </button>

                {message && (
                  <div className={`flex items-center gap-2 text-sm ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
