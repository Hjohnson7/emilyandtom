import React, { useState, useRef, ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import api from '../../constants/api';
import { X, UploadCloud, Loader2, RefreshCw } from 'lucide-react';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const DropZone = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  position: relative;
  background: ${({ isDragOver, theme }) =>
        isDragOver ? theme.colors.backgroundLighter : 'transparent'};
  transition: background 0.2s;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Thumbnails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Thumb = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  background: #f7f7fa;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
  border: none;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
`;

const UploadBar = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`;

const UploadButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  
  &:hover:not([disabled]) {
    filter: brightness(1.05);
  }
`;

const Small = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorBox = styled.div`
  background: ${({ theme }) => theme.colors.errorBackground || '#ffe9e9'};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder || '#ff4f4f'};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RetryLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: 600;
  display: flex;
  gap: 4px;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid ${({ theme }) => theme.colors.onPrimary}33;
  border-top-color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;


function generateUUID() {
    if (typeof crypto !== 'undefined' && (crypto).randomUUID) {
      return (crypto).randomUUID();
    }
    // fallback to manual RFC4122 v4
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
  }

const MultiPhotoUploader = ({
    uploadUrl = "/invitations/guest-photos/",
    token,
    onComplete,
}) => {
    const [files, setFiles] = useState([]);
    const [globalError, setGlobalError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);

    const addFiles = (newFiles) => {
        const arr = Array.from(newFiles).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            id: generateUUID(),
            status: 'ready',
        }));
        setFiles(prev => [...prev, ...arr]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
        }
    };


    // utility to normalize and create preview entries
    const makePreviewFiles = (files) => {
        const arr = Array.from(files).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            id: generateUUID(),
            status: 'ready',
        }));
        return arr;
    };

    const handleSelect = (e) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        // copy immediately before any possible mutation
        const newPreviews = makePreviewFiles(fileList);
        setFiles(prev => [...prev, ...newPreviews]);

        // allow re-selecting same file in future
        e.target.value = "";
    };


    const removeFile = (id) => {
        setFiles(f => f.filter(x => x.id !== id));
    };

    const uploadAll = async () => {
        if (!files.length) return;
        setGlobalError(null);
        setIsUploading(true);
        const form = new FormData();
        files.forEach(f => {
            if (f.status === 'ready' || f.status === 'error') {
                form.append("images", f.file);
            }
        });

        try {
            // optimistic: mark uploading
            setFiles(f => f.map(f => (f.status === 'ready' || f.status === 'error' ? { ...f, status: 'uploading', error: undefined } : f)));

            const headers = {
                "Content-Type": "multipart/form-data",
            };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await api.post(uploadUrl, form, { headers });

            // success: assume response.photos is array of created
            const returned = res.data.photos || res.data;

            // mark all done (simple mapping; for real apps correlate by filename or more advanced)
            setFiles(f =>
                f.map(ff => ({
                    ...ff,
                    status: 'done',
                    responseData: returned, // you might want to map per-file if backend returns per-image
                }))
            );
            onComplete?.(returned);
        } catch (err) {
            console.error("Upload failed", err);
            setGlobalError("Upload failed. Some files may not have been sent.");
            // mark errored ones
            setFiles(f =>
                f.map(ff => {
                    if (ff.status === 'uploading') {
                        return {
                            ...ff,
                            status: 'error',
                            error: err?.response?.data?.detail || "Network/server error",
                        };
                    }
                    return ff;
                })
            );
        } finally {
            setIsUploading(false);
        }
    };

    const retryFile = async (fileObj) => {
        setGlobalError(null);
        setFiles(f =>
            f.map(ff => (ff.id === fileObj.id ? { ...ff, status: 'uploading', error: undefined } : ff))
        );
        const form = new FormData();
        form.append("images", fileObj.file);

        try {
            const headers = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            const res = await axios.post(uploadUrl, form, { headers });
            const returned = res.data.photos || res.data;
            setFiles(f =>
                f.map(ff => (ff.id === fileObj.id ? { ...ff, status: 'done', responseData: returned } : ff))
            );
            onComplete?.(returned);
        } catch (e) {
            setFiles(f =>
                f.map(ff => (ff.id === fileObj.id ? { ...ff, status: 'error', error: e?.response?.data?.detail || "Upload failed" } : ff))
            );
        }
    };

    return (
        <Container>
            <DropZone
                isDragOver={false}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                aria-label="Drop images here or click to select"
            >
                <HiddenInput
                    ref={el => (inputRef.current = el)}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSelect}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <UploadCloud size={24} />
                    <div>
                        <strong>Drag & drop photos</strong> or <span style={{ textDecoration: "underline" }}>browse</span>
                        <div style={{ fontSize: 12, marginTop: 4 }}>You can upload multiple images at once.</div>
                    </div>
                </div>
            </DropZone>

            {files.length > 0 && (
                <>
                    <Thumbnails>
                        {files.map(f => (
                            <Thumb key={f.id}>
                                <Img src={f.preview} alt={f.file.name} />
                                <RemoveBtn aria-label="Remove" onClick={() => removeFile(f.id)}>
                                    <X size={14} />
                                </RemoveBtn>
                                {f.status === 'uploading' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(255,255,255,0.7)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Loader2 size={32} className="spin" />
                                    </div>
                                )}
                                {f.status === 'error' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(255, 90, 90, 0.9)',
                                            color: 'white',
                                            padding: '4px',
                                            fontSize: 10,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {f.error || "Failed"}
                                        </div>
                                        <RetryLink onClick={() => retryFile(f)}>Retry</RetryLink>
                                    </div>
                                )}
                            </Thumb>
                        ))}
                    </Thumbnails>

                    <UploadBar>
                        <UploadButton onClick={uploadAll} disabled={isUploading || files.every(f => f.status === 'done')}>
                            {isUploading ? (
                                <>
                                    <Spinner /> Uploading...
                                </>
                            ) : (
                                <>
                                    <UploadCloud size={16} /> Upload {files.filter(f => f.status !== 'done').length} Photo
                                    {files.filter(f => f.status !== 'done').length > 1 ? 's' : ''}
                                </>
                            )}
                        </UploadButton>
                        <Small>Supported formats: JPG, PNG. Max size per image: (you can enforce in validation)</Small>
                    </UploadBar>
                </>
            )}

            {globalError && (
                <ErrorBox role="alert">
                    <div>{globalError}</div>
                    <RetryLink onClick={uploadAll}>
                        <RefreshCw size={14} /> Retry All
                    </RetryLink>
                </ErrorBox>
            )}
        </Container>
    );
};

export default MultiPhotoUploader;
