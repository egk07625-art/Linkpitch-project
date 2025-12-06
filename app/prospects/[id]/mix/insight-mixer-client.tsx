'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { GeneratedEmail } from '@/types/generated-email';
import {
  ArrowLeft, Save, Send, Sparkles, FileText,
  Image as ImageIcon, LayoutTemplate,
  Check, Mail, UploadCloud, X,
  BarChart2, TrendingUp, HelpCircle, ShieldCheck, FileOutput,
  Plus, Folder, FolderOpen, ChevronRight, ChevronDown, MoreHorizontal,
  User, Users
} from 'lucide-react';
import { toast } from 'sonner';

const SUBJECT_CATEGORIES: Record<string, { label: string, icon: any }> = {
  metric_direct: { label: "지표 직격형", icon: BarChart2 },
  soft_fomo: { label: "경쟁 심리형", icon: TrendingUp },
  curiosity: { label: "호기심 유발형", icon: HelpCircle },
  report_bait: { label: "리포트 제안형", icon: FileOutput },
  plain_trust: { label: "신뢰 기반형", icon: ShieldCheck }
};

// [NEW] Asset Type Definition
type Asset = {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
};

// [NEW] Folder Type Definition
type FolderType = {
  id: string;
  name: string;
  isOpen: boolean;
  assets: Asset[];
};

interface InsightMixerClientProps {
  prospectId: string;
}

export default function InsightMixerClient({ prospectId }: InsightMixerClientProps) {
  // --- State ---
  const [loading, setLoading] = useState(true);
  const [prospect, setProspect] = useState<any>(null);
  const [allStepsData, setAllStepsData] = useState<GeneratedEmail[]>([]);

  // UI State
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'email' | 'report'>('email');
  const [selectedBodyType, setSelectedBodyType] = useState('solopreneur');

  // Subject
  const [activeSubjectCategory, setActiveSubjectCategory] = useState<string>('metric_direct');
  const [selectedSubjectText, setSelectedSubjectText] = useState('');

  // [NEW] Asset Management State (Folder System)
  const [myFolders, setMyFolders] = useState<FolderType[]>([
    { id: 'f1', name: '자주 쓰는 자료', isOpen: true, assets: [] }, // Default Folder
    { id: 'f2', name: '회사 소개서', isOpen: false, assets: [] }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor Ref (이미지 삽입을 위해 필요)
  const editorRef = useRef<HTMLDivElement>(null);

  // --- Fetch ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: prospectData } = await supabase.from('prospects').select('*').eq('id', prospectId).single();
      if (prospectData) setProspect(prospectData);

      const { data: emailData } = await supabase.from('generated_emails').select('*').eq('prospect_id', prospectId).order('step_number', { ascending: true });
      if (emailData && emailData.length > 0) setAllStepsData(emailData as GeneratedEmail[]);

      setLoading(false);
    };
    fetchData();
  }, [prospectId]);

  // --- Logic ---
  const currentStepData = allStepsData.find(item => item.step_number === activeStep);

  let subjectOptions: Record<string, string[]> = {};
  try {
    const rawSubjects = currentStepData?.email_subjects;
    if (typeof rawSubjects === 'string') {
      subjectOptions = JSON.parse(rawSubjects);
    } else if (typeof rawSubjects === 'object' && rawSubjects !== null) {
      Object.entries(rawSubjects).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          subjectOptions[key] = value;
        } else if (typeof value === 'string') {
          subjectOptions[key] = [value];
        }
      });
    }
  } catch (e) {
    console.error('[InsightMixer] email_subjects 파싱 실패:', e);
    subjectOptions = {};
  }

  const getCleanBody = (type: 'solopreneur' | 'corporate') => {
      const rawBody = currentStepData?.[`email_body_${type}`];
      if (!rawBody) return "데이터 로딩 중...";
      return rawBody.replace(/\n/g, '');
  };

  const currentBodyHtml = getCleanBody(selectedBodyType as 'solopreneur' | 'corporate');
  const reportHtml = currentStepData?.report_html_editable || "<p class='text-zinc-500 text-sm'>생성된 리포트가 없습니다.</p>";
  const currentCategorySubjects = subjectOptions?.[activeSubjectCategory] || [];

  useEffect(() => {
      if (currentCategorySubjects.length > 0 && !selectedSubjectText) {
          setSelectedSubjectText(currentCategorySubjects[0]);
      }
  }, [currentCategorySubjects, selectedSubjectText]);

  // --- Asset Handlers (File Upload & Insert) ---

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
  };

  const handleFiles = (files: FileList) => {
    const newAssets: Asset[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file) // MVP용 임시 URL
    }));

    // [Logic] 첫 번째 폴더('자주 쓰는 자료')에 자동 추가
    setMyFolders(prev => prev.map((folder, idx) =>
      idx === 0 ? { ...folder, assets: [...folder.assets, ...newAssets] } : folder
    ));
    toast.success(`${files.length}개의 파일이 추가되었습니다.`);
  };

  const toggleFolder = (folderId: string) => {
    setMyFolders(prev => prev.map(f => f.id === folderId ? { ...f, isOpen: !f.isOpen } : f));
  };

  // [핵심] 이미지/파일 삽입 로직
  const insertAssetToEditor = (asset: Asset) => {
    if (!editorRef.current) return;

    // 현재 커서 위치 또는 에디터 끝에 삽입
    editorRef.current.focus();

    if (asset.type === 'image') {
      // 1. 이미지 태그 생성 (HTML)
      document.execCommand('insertHTML', false,
        `<br><img src="${asset.url}" alt="${asset.name}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" /><br>`
      );
      toast.success("이미지가 본문에 삽입되었습니다.");
    } else {
      // 2. 파일 링크 텍스트 생성
      document.execCommand('insertText', false, ` [첨부파일: ${asset.name}] `);
      toast.info("파일명이 본문에 삽입되었습니다.");
    }
  };


  // --- Rendering ---
  if (loading) return <div className="h-screen bg-black text-white flex items-center justify-center font-medium">Loading Workspace...</div>;
  if (!prospect) return <div className="h-screen bg-black text-white flex items-center justify-center font-medium">Client Not Found</div>;

  return (
    <div className="h-screen w-full bg-[#050505] text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">

      {/* Header */}
      <header className="h-16 border-b border-[#222] bg-[#0A0A0A] flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/prospects" className="p-2 -ml-2 rounded-lg text-zinc-500 hover:text-white hover:bg-[#1C1C1E] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="h-5 w-[1px] bg-[#333]" />
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-zinc-400 border border-[#333]">{prospect.name.charAt(0)}</div>
             <div>
                <h1 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">{prospect.store_name || prospect.name}</h1>
                <span className="text-xs text-zinc-500 font-medium">{prospect.category}</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="h-9 px-4 rounded-lg border border-[#333] bg-transparent text-xs font-medium text-zinc-400 hover:bg-[#1C1C1E] hover:text-white transition-colors flex items-center gap-2"><Save className="w-4 h-4" /> <span>임시 저장</span></button>
           <button className="h-9 px-5 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/5"><Send className="w-4 h-4" /> <span>발송하기</span></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

         {/* [Left Panel] Asset Library (업그레이드됨) */}
         <aside className="w-[360px] border-r border-[#222] bg-[#0A0A0A] flex flex-col shrink-0">
            <div className="px-6 py-5 border-b border-[#222] bg-[#0A0A0A]">
               <h2 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  소재 라이브러리
               </h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0">

               {/* 1. Theme Info */}
               <div className="p-6 pb-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase mb-2 block tracking-wider">분석 테마</label>
                  <div className="bg-[#111] border border-[#222] rounded-xl p-4">
                     <p className="text-sm text-zinc-300 font-medium leading-relaxed">{currentStepData?.theme || "분석 테마가 없습니다."}</p>
                  </div>
               </div>

               {/* 2. Drag & Drop Zone (Improved) */}
               <div className="px-6 pt-2 pb-4">
                  <div
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                     onClick={() => fileInputRef.current?.click()}
                     className={`
                        relative border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-32
                        ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#111] hover:border-zinc-500 hover:bg-[#161618]'}
                     `}
                  >
                     <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                     <UploadCloud className={`w-8 h-8 mb-2 ${isDragging ? 'text-blue-500' : 'text-zinc-500'}`} />
                     <p className="text-xs text-zinc-400 font-medium">자료를 이곳에 드래그하세요</p>
                  </div>
               </div>

               {/* 3. Folder System (Finder Style) */}
               <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
                  {myFolders.map((folder) => (
                     <div key={folder.id} className="select-none">
                        {/* Folder Header */}
                        <div
                           onClick={() => toggleFolder(folder.id)}
                           className="flex items-center gap-2 py-2 px-1 cursor-pointer text-zinc-400 hover:text-white transition-colors group"
                        >
                           {folder.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                           {folder.isOpen ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 group-hover:text-blue-400" />}
                           <span className="text-xs font-bold uppercase tracking-wide">{folder.name}</span>
                           <span className="text-[10px] text-zinc-600 ml-auto">{folder.assets.length}</span>
                        </div>

                        {/* Folder Contents */}
                        {folder.isOpen && (
                           <div className="pl-4 mt-1 space-y-1 border-l border-[#222] ml-1.5">
                              {folder.assets.length === 0 ? (
                                 <div className="py-2 text-[10px] text-zinc-700 italic pl-4">비어있음</div>
                              ) : (
                                 folder.assets.map((asset) => (
                                    <div
                                       key={asset.id}
                                       onClick={() => insertAssetToEditor(asset)}
                                       className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1C1C1E] cursor-pointer transition-all"
                                    >
                                       {/* Preview Thumbnail */}
                                       <div className="w-10 h-10 rounded bg-[#000] border border-[#222] flex items-center justify-center shrink-0 overflow-hidden">
                                          {asset.type === 'image' ? (
                                             <img src={asset.url} alt={asset.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                          ) : (
                                             <FileText className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
                                          )}
                                       </div>

                                       <div className="flex-1 min-w-0">
                                          <p className="text-xs text-zinc-300 truncate font-medium group-hover:text-white">{asset.name}</p>
                                          <p className="text-[9px] text-zinc-600 group-hover:text-blue-400 transition-colors">클릭하여 본문에 삽입</p>
                                       </div>
                                    </div>
                                 ))
                              )}
                           </div>
                        )}
                     </div>
                  ))}
               </div>

            </div>
         </aside>

         {/* [3] Center Panel: Main Editor */}
         <main className="flex-1 bg-[#050505] flex flex-col relative min-w-0">

            {/* Step Navigator */}
            <div className="h-16 border-b border-[#222] flex items-center justify-center gap-2 bg-[#0A0A0A]">
               {[1, 2, 3, 4, 5].map((step) => {
                  const hasData = allStepsData.some(d => d.step_number === step);
                  const isActive = activeStep === step;
                  return (
                    <button
                        key={step}
                        onClick={() => { setActiveStep(step); setActiveSubjectCategory('metric_direct'); setSelectedSubjectText(''); }}
                        className={`h-9 px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${isActive ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]' : hasData ? 'bg-[#111] text-zinc-400 border-[#333] hover:border-zinc-500 hover:text-zinc-200' : 'bg-[#0A0A0A] text-zinc-800 border-[#222] cursor-not-allowed'}`}
                    >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${isActive ? 'bg-black text-white' : 'bg-[#222] text-zinc-600'}`}>{step}</span>
                        <span>Step</span>
                    </button>
                  );
               })}
            </div>

            <div className="flex-1 overflow-y-auto p-10 md:p-14">
               <div className="max-w-4xl mx-auto space-y-12">

                  {/* Mode Switcher */}
                  <div className="flex justify-center">
                     <div className="p-1.5 bg-[#111] border border-[#222] rounded-xl flex items-center shadow-inner">
                        <button onClick={() => setActiveTab('email')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'email' ? 'bg-[#2C2C2E] text-white shadow-sm border border-[#333]' : 'text-zinc-500 hover:text-zinc-300'}`}><Mail className="w-4 h-4" /> 이메일</button>
                        <button onClick={() => setActiveTab('report')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'report' ? 'bg-[#2C2C2E] text-white shadow-sm border border-[#333]' : 'text-zinc-500 hover:text-zinc-300'}`}><FileText className="w-4 h-4" /> 리포트</button>
                     </div>
                  </div>

                  {activeTab === 'email' && (
                     <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Subject Picker */}
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Subject Options</label>
                           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                              {Object.keys(SUBJECT_CATEGORIES).map((key) => {
                                 const Icon = SUBJECT_CATEGORIES[key].icon;
                                 return (
                                    <button key={key} onClick={() => setActiveSubjectCategory(key)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border whitespace-nowrap ${activeSubjectCategory === key ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-[#111] text-zinc-500 border-[#222] hover:border-zinc-700 hover:text-zinc-300'}`}><Icon className="w-3.5 h-3.5" />{SUBJECT_CATEGORIES[key].label}</button>
                                 )
                              })}
                           </div>
                           <div className="grid grid-cols-1 gap-3">
                              {currentCategorySubjects.length > 0 ? (
                                 currentCategorySubjects.map((subject, idx) => (
                                    <div key={idx} onClick={() => setSelectedSubjectText(subject)} className={`group px-6 py-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedSubjectText === subject ? 'bg-[#1C1C1E] border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-[#0F0F0F] border-[#222] hover:border-zinc-600'}`}>
                                       <p className={`text-base font-medium ${selectedSubjectText === subject ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{subject}</p>
                                       {selectedSubjectText === subject && <Check className="w-5 h-5 text-blue-500" />}
                                    </div>
                                 ))
                              ) : <div className="p-6 rounded-xl border border-[#222] bg-[#0F0F0F] text-zinc-600 text-sm text-center">제목 없음</div>}
                           </div>
                        </div>

                        {/* Body Editor */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest"><FileText className="w-3.5 h-3.5 text-blue-500" /> Body Content</label>
                              <div className="flex bg-[#111] rounded-lg p-1 border border-[#222]">
                                 <button onClick={() => setSelectedBodyType('solopreneur')} className={`flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-md transition-all font-bold ${selectedBodyType === 'solopreneur' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><User className="w-3.5 h-3.5" /> 대표님용</button>
                                 <button onClick={() => setSelectedBodyType('corporate')} className={`flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-md transition-all font-bold ${selectedBodyType === 'corporate' ? 'bg-[#2C2C2E] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><Users className="w-3.5 h-3.5" /> 실무자용</button>
                              </div>
                           </div>

                           <div className="min-h-[500px] bg-[#0F0F0F] border border-[#222] rounded-2xl p-10 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 transition-all shadow-inner">
                              {/* ⚡ 진짜 에디터: ref 연결 및 이미지 삽입 가능 */}
                              <div
                                 ref={editorRef}
                                 className="text-lg text-zinc-300 leading-8 font-light outline-none prose prose-invert max-w-none prose-p:my-4 prose-strong:text-white prose-strong:font-bold prose-img:rounded-xl prose-img:shadow-lg"
                                 contentEditable
                                 suppressContentEditableWarning
                                 dangerouslySetInnerHTML={{ __html: currentBodyHtml }}
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Report View */}
                  {activeTab === 'report' && (
                     <div className="min-h-[700px] bg-white border border-zinc-200 rounded-2xl p-12 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-2xl">
                        <div className="prose prose-zinc max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: reportHtml }} />
                     </div>
                  )}

               </div>
            </div>
         </main>

         {/* Right Panel (Preview) */}
         <aside className="w-[340px] border-l border-[#222] bg-[#0A0A0A] flex flex-col shrink-0">
            <div className="px-5 py-4 border-b border-[#222] bg-[#0A0A0A]">
               <h2 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider"><BarChart2 className="w-3.5 h-3.5" />Preview</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#050505] flex items-center justify-center">
               <div className="w-full bg-white rounded-[24px] overflow-hidden border-[6px] border-[#1C1C1E] shadow-2xl relative min-h-[480px]">
                  <div className="h-5 bg-white w-full flex justify-center items-center border-b border-gray-100"><div className="w-12 h-3 bg-black rounded-b-lg" /></div>
                  <div className="p-4 bg-gray-50 h-full">
                     <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-3">
                        <div className="flex gap-2 items-center mb-2">
                           <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white font-bold text-[8px]">LP</div>
                           <div><p className="text-[10px] font-bold text-gray-900">LinkPitch</p><p className="text-[8px] text-gray-400">now</p></div>
                        </div>
                        <div className="text-[10px] text-gray-800 leading-relaxed font-medium">
                           <p className="font-bold mb-1.5">{selectedSubjectText || "Subject..."}</p>
                           <p className="line-clamp-[8] text-gray-600 font-light">{currentBodyHtml.replace(/<[^>]*>?/gm, '')}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </aside>

      </div>
    </div>
  )
}
