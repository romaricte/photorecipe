'use client';

import type { ChangeEvent, DragEvent } from 'react';
import { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PhotoUploaderProps {
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  photoPreview: string | null;
  isLoading: boolean;
}

export function PhotoUploader({ onPhotoUpload, onGenerate, photoPreview, isLoading }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Camera className="w-6 h-6" /> Upload a Photo
        </CardTitle>
        <CardDescription>
          Drag & drop an image of your food, or click to select a file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={onPhotoUpload} disabled={isLoading} />
        <label
          htmlFor="photo-upload"
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            handleDrag(e, false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const mockEvent = {
                target: { files: e.dataTransfer.files },
              } as unknown as ChangeEvent<HTMLInputElement>;
              onPhotoUpload(mockEvent);
            }
          }}
          className={cn(
            "w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center cursor-pointer transition-colors duration-200",
            "text-muted-foreground hover:border-accent hover:text-accent-foreground",
            isDragging ? "border-accent bg-accent/10" : "border-primary/20 bg-card/50"
          )}
        >
          {photoPreview ? (
            <Image src={photoPreview} alt="Uploaded food" width={500} height={250} className="object-contain max-h-full max-w-full rounded-md" />
          ) : (
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 mb-2" />
              <p className="font-semibold">Click or drag file to this area to upload</p>
              <p className="text-xs">Supports: JPEG, PNG, WEBP</p>
            </div>
          )}
        </label>
        <Button onClick={onGenerate} disabled={!photoPreview || isLoading} size="lg" className="w-full font-bold">
          {isLoading ? (
            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Generating...' : 'Find Recipe'}
        </Button>
      </CardContent>
    </Card>
  );
}
