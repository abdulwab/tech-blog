'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Code, Eye, FileText } from 'lucide-react'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 border border-[var(--border-primary)] rounded-md bg-[var(--background-secondary)] flex items-center justify-center">
      <p className="text-[var(--text-secondary)]">Loading editor...</p>
    </div>
  ),
})

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<'wysiwyg' | 'html' | 'preview'>('wysiwyg')
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    setMounted(true)
    setHtmlContent(value)
  }, [])

  useEffect(() => {
    setHtmlContent(value)
  }, [value])

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ]

  const handleModeChange = (newMode: 'wysiwyg' | 'html' | 'preview') => {
    if (newMode === 'html' && mode === 'wysiwyg') {
      // Switching from WYSIWYG to HTML
      setHtmlContent(value)
    } else if (newMode === 'wysiwyg' && mode === 'html') {
      // Switching from HTML to WYSIWYG
      onChange(htmlContent)
    }
    setMode(newMode)
  }

  const handleHtmlChange = (newHtml: string) => {
    setHtmlContent(newHtml)
    onChange(newHtml)
  }

  if (!mounted) {
    return (
      <div className="w-full h-64 border border-[var(--border-primary)] rounded-md bg-[var(--background-secondary)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
      {/* Mode Toggle Header */}
      <div className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">Editor Mode:</span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleModeChange('wysiwyg')}
              className={`flex items-center px-3 py-1 text-xs rounded transition-colors ${
                mode === 'wysiwyg'
                  ? 'bg-[var(--accent-web)] text-white'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <FileText className="w-3 h-3 mr-1" />
              Visual
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('html')}
              className={`flex items-center px-3 py-1 text-xs rounded transition-colors ${
                mode === 'html'
                  ? 'bg-[var(--accent-web)] text-white'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Code className="w-3 h-3 mr-1" />
              HTML
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('preview')}
              className={`flex items-center px-3 py-1 text-xs rounded transition-colors ${
                mode === 'preview'
                  ? 'bg-[var(--accent-web)] text-white'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)]'
              }`}
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </button>
          </div>
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          {mode === 'html' && 'Paste your HTML content here'}
          {mode === 'wysiwyg' && 'WYSIWYG Editor'}
          {mode === 'preview' && 'Preview Mode'}
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        {mode === 'wysiwyg' && (
          <div className="quill-editor">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder || "Write your content here..."}
            />
          </div>
        )}

        {mode === 'html' && (
          <textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            placeholder="Paste your HTML content here..."
            className="w-full h-96 p-4 border-0 resize-none focus:outline-none bg-[var(--card-bg)] text-[var(--text-primary)] font-mono text-sm"
            style={{ minHeight: '400px' }}
          />
        )}

        {mode === 'preview' && (
          <div className="p-4 prose prose-lg max-w-none bg-[var(--card-bg)]">
            <div 
              className="text-[var(--text-primary)]"
              dangerouslySetInnerHTML={{ __html: htmlContent || value }}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .quill-editor .ql-editor {
          min-height: 350px;
          font-size: 16px;
          line-height: 1.6;
          padding: 12px 15px;
          background-color: var(--card-bg);
          color: var(--text-primary);
        }
        .quill-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid var(--border-primary);
          background-color: var(--background-secondary);
        }
        .quill-editor .ql-container {
          border: none;
          font-family: inherit;
        }
        .quill-editor .ql-editor:focus {
          outline: none;
        }
        .quill-editor .ql-toolbar .ql-stroke {
          stroke: var(--text-primary);
        }
        .quill-editor .ql-toolbar .ql-fill {
          fill: var(--text-primary);
        }
        .quill-editor .ql-toolbar button:hover .ql-stroke {
          stroke: var(--accent-web);
        }
        .quill-editor .ql-toolbar button:hover .ql-fill {
          fill: var(--accent-web);
        }
        .quill-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--accent-web);
        }
        .quill-editor .ql-toolbar button.ql-active .ql-fill {
          fill: var(--accent-web);
        }
      `}</style>
    </div>
  )
}