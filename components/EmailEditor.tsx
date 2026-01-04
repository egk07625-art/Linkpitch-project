'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import './editor-styles.css'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { marked } from 'marked' // 마크다운 -> HTML 변환 엔진
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript.js'
import typescript from 'highlight.js/lib/languages/typescript.js'
import python from 'highlight.js/lib/languages/python.js'
import css from 'highlight.js/lib/languages/css.js'
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, 
  List, ListOrdered, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
  Table as TableIcon, AlignLeft, AlignCenter, AlignRight, Code,
  Minus, Palette, Highlighter, Upload, Loader2
} from 'lucide-react'
import { toast } from 'sonner'

// Lowlight 설정
const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('css', css)

// 컴포넌트 Props 타입 정의
interface EmailEditorProps {
  content: string;            // n8n/Supabase에서 넘어오는 원본 데이터
  onChange: (html: string) => void; 
  onImageUpload?: (file: File) => Promise<string | null>; // 이미지 업로드 핸들러
  placeholder?: string;       
  editable?: boolean;         
}

/**
 * [고도화된 EmailEditor]
 * 1. MIT 라이선스인 Tiptap 라이브러리 사용
 * 2. n8n 데이터의 고질적인 문제(<br>, 역슬래시 노출)를 정규표현식으로 완벽 제거
 * 3. Supabase 저장에 최적화된 표준 HTML 생성
 * 4. 이미지, 테이블, 색상, 정렬 등 고급 편집 기능 지원
 */
const EmailEditor = ({ 
  content, 
  onChange, 
  onImageUpload,
  placeholder = '이메일 내용을 작성 중입니다...',
  editable = true 
}: EmailEditorProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * [강력한 데이터 전처리 엔진]
   * 화면을 더럽히는 <br>, \, \n 등의 노이즈를 싹 지우고 순수 HTML로 굽습니다.
   */
  const getCleanHtml = (raw: string) => {
    if (!raw) return '';

    let processed = raw
      .replace(/\\n/g, '\n')           // 문자열 형태의 \n을 실제 줄바꿈으로
      .replace(/<br\s*\/?>/gi, '\n')   // 문자열 <br> 태그를 실제 줄바꿈으로 (가장 중요)
      .replace(/\\$/gm, '')            // 문장 끝의 보기 싫은 역슬래시 제거
      .replace(/\\/g, '')              // 남아있는 모든 역슬래시 제거
      .replace(/&lt;br&gt;/gi, '\n')   // 인코딩된 <br> 태그 대응
      .trim();

    // 마크다운 기호(**, ### 등)를 리치 텍스트용 HTML로 변환
    return marked.parse(processed, {
      breaks: true, // 일반 줄바꿈을 <br>로 인식하도록 설정
      gfm: true     // GitHub 방식 마크다운 지원
    });
  };

  // 초기 렌더링을 위해 정제된 HTML 생성
  const initialHtml = useMemo(() => getCleanHtml(content), [content]);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        codeBlock: false, // CodeBlockLowlight 사용
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-50 px-4 py-2 font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ 
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-4 border-t-2 border-gray-300',
        },
      }),
    ],
    content: initialHtml, 
    editable: editable,
    onUpdate: ({ editor }) => {
      // Supabase 저장 시 'HTML 문자열' 타입으로 전달
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] p-10 bg-white text-black prose-headings:text-black prose-p:text-black prose-strong:text-black prose-li:text-black prose-ul:text-black prose-ol:text-black prose-blockquote:text-black prose-code:text-black [&_*]:text-black antialiased border-none outline-none [&_*]:select-text',
        style: 'user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important;',
      },
    },
    immediatelyRender: false,
  });

  // 데이터 동기화 (n8n 자동 생성 완료 시 대응)
  useEffect(() => {
    if (editor && content) {
      const currentHtml = editor.getHTML();
      const newCleanHtml = getCleanHtml(content);
      
      // 사용자가 직접 입력 중이지 않을 때만 외부 데이터를 정제하여 업데이트
      if (newCleanHtml !== currentHtml && !editor.isFocused) {
        editor.commands.setContent(newCleanHtml as string);
      }
    }
  }, [content, editor]);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor || !onImageUpload) return

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    setIsUploading(true)
    try {
      const url = await onImageUpload(file)
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
        toast.success('이미지가 업로드되었습니다.')
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      toast.error('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!editor) return null;

  return (
    <div 
      className="flex flex-col w-full border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xl transition-all duration-300 ring-1 ring-black/5 font-sans"
      style={{ userSelect: 'text', WebkitUserSelect: 'text', MozUserSelect: 'text', msUserSelect: 'text' }}
    >
      {/* 고도화된 프리미엄 툴바 UI */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo size={18} />
          </ToolbarButton>
        </div>
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
            <UnderlineIcon size={18} />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
            <Heading1 size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
            <Heading2 size={18} />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
            <ListOrdered size={18} />
          </ToolbarButton>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
            <AlignLeft size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
            <AlignCenter size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
            <AlignRight size={18} />
          </ToolbarButton>
        </div>

        {/* Color & Highlight */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2 relative">
          <div className="relative">
            <ToolbarButton onClick={() => setShowColorPicker(!showColorPicker)}>
              <Palette size={18} />
            </ToolbarButton>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="grid grid-cols-5 gap-1">
                  {['#000000', '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#2563EB', '#7C3AED', '#DB2777'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run()
                        setShowColorPicker(false)
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <ToolbarButton onClick={() => setShowHighlightPicker(!showHighlightPicker)}>
              <Highlighter size={18} />
            </ToolbarButton>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="grid grid-cols-5 gap-1">
                  {['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#E0E7FF', '#FED7AA'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run()
                        setShowHighlightPicker(false)
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ToolbarButton 
            onClick={() => fileInputRef.current?.click()} 
            disabled={!onImageUpload || isUploading}
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
          </ToolbarButton>
        </div>

        {/* Table */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton 
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            disabled={editor.isActive('table')}
          >
            <TableIcon size={18} />
          </ToolbarButton>
        </div>

        {/* Code Block */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>
            <Code size={18} />
          </ToolbarButton>
        </div>

        {/* Horizontal Rule */}
        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus size={18} />
          </ToolbarButton>
        </div>
      </div>

      {/* Table Controls (shown when table is active) */}
      {editor.isActive('table') && (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-100 bg-blue-50/50">
          <button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            열 추가 (앞)
          </button>
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            열 추가 (뒤)
          </button>
          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            열 삭제
          </button>
          <button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            행 추가 (위)
          </button>
          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            행 추가 (아래)
          </button>
          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            행 삭제
          </button>
          <button
            onClick={() => editor.chain().focus().mergeCells().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            셀 병합
          </button>
          <button
            onClick={() => editor.chain().focus().splitCell().run()}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            셀 분리
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            표 삭제
          </button>
        </div>
      )}

      {/* 실질적인 에디터 작성 공간 */}
      <div 
        className="relative flex-1 overflow-y-auto bg-white min-h-[550px]"
        style={{ userSelect: 'text', WebkitUserSelect: 'text', MozUserSelect: 'text', msUserSelect: 'text' }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

/**
 * 툴바 버튼 내부 컴포넌트
 */
const ToolbarButton = ({ onClick, active = false, disabled = false, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2.5 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-white shadow-md text-indigo-600 ring-1 ring-gray-200 font-bold' 
        : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-900'
    } ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

export default EmailEditor;