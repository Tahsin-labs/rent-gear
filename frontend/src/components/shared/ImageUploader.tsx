"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/cloudinary";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadImage(file);
        newUrls.push(url);
      } catch (err: unknown) {
        toast.error((err as { message?: string })?.message || `Failed to upload ${file.name}`);
      }
    }

    if (newUrls.length > 0) {
      onChange?.([...value, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded successfully`);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (!/^https?:\/\/.+/i.test(urlInput.trim())) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    if (value.length >= maxFiles) {
      toast.error(`Maximum of ${maxFiles} images reached.`);
      return;
    }

    onChange?.([...value, urlInput.trim()]);
    setUrlInput("");
    toast.success("Image URL added");
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 cursor-pointer transition-colors border-muted-foreground/25"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading image(s)...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Click or drag images here to upload
            </p>
            <p className="text-xs">JPG, PNG, or WebP (max 5MB each)</p>
          </div>
        )}
      </div>

      {/* Paste URL directly */}
      <form onSubmit={handleAddUrl} className="flex gap-2">
        <Input
          placeholder="Or paste an image URL directly..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={isUploading || value.length >= maxFiles}
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!urlInput.trim() || isUploading || value.length >= maxFiles}
        >
          <LinkIcon className="h-4 w-4 mr-1" /> Add
        </Button>
      </form>

      {/* Preview thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {value.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <Image
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized={url.startsWith("data:")}
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
