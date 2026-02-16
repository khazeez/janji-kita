'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  UserPlus,
  Loader2,
  ChevronDown,
  FileSpreadsheet,
  Smartphone,
  Users,
  Upload,
  X,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import { getDataInvitationUserByUserId } from '@/models/invitations';
import { AllInvitationData } from '@/types/interface';
import * as XLSX from 'xlsx';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

type InputMode = 'manual' | 'phone' | 'excel';

const MESSAGE_TEMPLATES = [
  {
    id: 'formal',
    name: 'Formal & Resmi',
    template: (name: string, groom: string, bride: string, link: string) => 
`Assalamualaikum Wr. Wb.
Kepada Yth. ${name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami:

*${groom} & ${bride}*

Informasi lengkap acara dapat dilihat melalui undangan digital berikut:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Wassalamualaikum Wr. Wb.`
  },
  {
    id: 'casual',
    name: 'Santai & Friendly',
    template: (name: string, groom: string, bride: string, link: string) =>
`Halo ${name}! 👋

Kabar gembira nih! Kami ${groom} & ${bride} akan menikah dan kami ingin kamu hadir di momen spesial kami! 💕

Cek info lengkap acaranya di sini ya:
${link}

Ditunggu kehadirannya! 🎉
See you! ✨`
  },
  {
    id: 'elegant',
    name: 'Elegan & Modern',
    template: (name: string, groom: string, bride: string, link: string) =>
`Dear ${name},

We are delighted to invite you to celebrate our wedding:

✨ *${groom} & ${bride}* ✨

Please visit our digital invitation for complete details:
${link}

Your presence and blessing would mean the world to us.

With love,
${groom} & ${bride}`
  },
  {
    id: 'simple',
    name: 'Singkat & Padat',
    template: (name: string, groom: string, bride: string, link: string) =>
`Hi ${name},

Kami ${groom} & ${bride} menikah!

Undangan digital:
${link}

Ditunggu ya! 🙏💕`
  }
];

export default function SendInvitationBulk() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [invitations, setInvitations] = useState<AllInvitationData[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<AllInvitationData | null>(null);
  const [showInvitationDropdown, setShowInvitationDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(MESSAGE_TEMPLATES[0]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  
  // Manual input
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  
  // Excel import
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  
  // Sending state
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  useEffect(() => {
    async function loadInvitations() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        const data = await getDataInvitationUserByUserId(session.user.id);
        if (data && Array.isArray(data) && data.length > 0) {
          const publishedInvitations = data.filter((inv: AllInvitationData) => inv.invitationStatus === 'published');
          setInvitations(publishedInvitations);
          if (publishedInvitations.length > 0) {
            setSelectedInvitation(publishedInvitations[0]);
          }
        }
      }
      setLoading(false);
    }
    loadInvitations();
  }, []);

  const generateLink = (guestName: string) => {
    if (!selectedInvitation) return '';
    const baseUrl = `${window.location.origin}/${selectedInvitation.invitationUrl}`;
    return guestName ? `${baseUrl}?to=${encodeURIComponent(guestName)}` : baseUrl;
  };

  const addManualContact = () => {
    if (!manualName.trim() || !manualPhone.trim()) return;
    
    const newContact: Contact = {
      id: Date.now().toString(),
      name: manualName.trim(),
      phone: manualPhone.trim()
    };
    
    setContacts([...contacts, newContact]);
    setManualName('');
    setManualPhone('');
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handlePhoneContacts = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        // @ts-ignore
        const selectedContacts = await navigator.contacts.select(props, { multiple: true });
        
        const newContacts: Contact[] = selectedContacts.map((contact: any, index: number) => ({
          id: Date.now().toString() + index,
          name: contact.name?.[0] || 'Unknown',
          phone: contact.tel?.[0] || ''
        }));
        
        setContacts(prev => [...prev, ...newContacts]);
      } catch (error) {
        alert('Fitur akses kontak tidak didukung di browser ini. Gunakan mode Manual atau Import Excel.');
      }
    } else {
      alert('Browser Anda tidak mendukung akses kontak telepon. Silakan gunakan mode Manual atau Import Excel.');
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingExcel(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const newContacts: Contact[] = jsonData.map((row: any, index: number) => ({
          id: Date.now().toString() + index,
          name: row.Nama || row.nama || row.Name || row.name || 'Unknown',
          phone: String(row.Telepon || row.telepon || row.Phone || row.phone || row.HP || row.hp || '')
        })).filter((c: Contact) => c.name && c.phone);
        
        setContacts(prev => [...prev, ...newContacts]);
        setIsProcessingExcel(false);
      } catch (error) {
        alert('Gagal membaca file Excel. Pastikan format file benar.');
        setIsProcessingExcel(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const downloadExcelTemplate = () => {
    const template = [
      { Nama: 'Bpk. Ahmad Setiawan', Telepon: '081234567890' },
      { Nama: 'Ibu. Siti Rahmawati', Telepon: '081234567891' },
      { Nama: 'Sdra. Budi Santoso', Telepon: '081234567892' }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu');
    XLSX.writeFile(wb, 'Template_Daftar_Tamu.xlsx');
  };

  const sendBulkInvitations = async () => {
    if (contacts.length === 0 || !selectedInvitation) return;
    
    setIsSending(true);
    setSendProgress(0);
    
    const groom = selectedInvitation.invitationDataUser.groomNickName;
    const bride = selectedInvitation.invitationDataUser.brideNickName;
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const link = generateLink(contact.name);
      const message = selectedTemplate.template(contact.name, groom, bride, link);
      
      const cleanPhone = contact.phone.replace(/\D/g, '');
      const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
      const waUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
      
      setSendProgress(Math.round(((i + 1) / contacts.length) * 100));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsSending(false);
    setSendProgress(0);
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
          <p className="text-gray-400 text-xs">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 pb-24 lg:pb-8">
      {/* Top Nav */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all border border-gray-700 flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">Kirim Undangan</h1>
            <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Kirim undangan ke banyak tamu sekaligus.</p>
          </div>
        </div>

        {/* Invitation Selector */}
        {invitations.length > 0 && (
          <div className="relative">
            <button 
              onClick={() => setShowInvitationDropdown(!showInvitationDropdown)}
              className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white hover:bg-gray-750 transition-all sm:min-w-[200px] justify-between"
            >
              <span className="text-xs sm:text-sm font-medium truncate">
                {selectedInvitation ? `${selectedInvitation.invitationDataUser.groomNickName} & ${selectedInvitation.invitationDataUser.brideNickName}` : 'Pilih'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${showInvitationDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showInvitationDropdown && (
              <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-1 w-full sm:w-auto sm:min-w-[200px] bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl z-50 overflow-hidden">
                {invitations.map((inv) => (
                  <button
                    key={inv.invitationId}
                    onClick={() => {
                      setSelectedInvitation(inv);
                      setShowInvitationDropdown(false);
                    }}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hover:bg-gray-700 transition-colors ${selectedInvitation?.invitationId === inv.invitationId ? 'bg-pink-500/10 text-pink-500' : 'text-gray-300'}`}
                  >
                    {inv.invitationDataUser.groomNickName} & {inv.invitationDataUser.brideNickName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {invitations.length === 0 ? (
        <div className="bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Belum ada undangan aktif</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Silakan buat dan aktivasi undangan terlebih dahulu.</p>
          <button 
            onClick={() => router.push('/dashboard/catalogue')}
            className="bg-pink-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-bold hover:bg-pink-500 transition-all"
          >
            Buat Undangan
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {/* Left: Contact Management */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-700/50">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">Daftar Tamu</h3>
                <span className="ml-auto text-[10px] sm:text-xs bg-pink-500/10 text-pink-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold">
                  {contacts.length} Kontak
                </span>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => setInputMode('manual')}
                  className={`p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${inputMode === 'manual' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}
                >
                  <UserPlus className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 ${inputMode === 'manual' ? 'text-pink-500' : 'text-gray-500'}`} />
                  <p className={`text-[10px] sm:text-xs font-bold ${inputMode === 'manual' ? 'text-pink-500' : 'text-gray-400'}`}>Manual</p>
                </button>

                <button
                  onClick={() => {
                    setInputMode('phone');
                    handlePhoneContacts();
                  }}
                  className={`p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${inputMode === 'phone' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}
                >
                  <Smartphone className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 ${inputMode === 'phone' ? 'text-pink-500' : 'text-gray-500'}`} />
                  <p className={`text-[10px] sm:text-xs font-bold ${inputMode === 'phone' ? 'text-pink-500' : 'text-gray-400'}`}>Dari HP</p>
                </button>

                <button
                  onClick={() => setInputMode('excel')}
                  className={`p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${inputMode === 'excel' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}
                >
                  <FileSpreadsheet className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 ${inputMode === 'excel' ? 'text-pink-500' : 'text-gray-500'}`} />
                  <p className={`text-[10px] sm:text-xs font-bold ${inputMode === 'excel' ? 'text-pink-500' : 'text-gray-400'}`}>Excel</p>
                </button>
              </div>

              {/* Input Forms */}
              {inputMode === 'manual' && (
                <div className="space-y-2.5 sm:space-y-3">
                  <input
                    type="text"
                    placeholder="Nama tamu"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  />
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="tel"
                      placeholder="Nomor WhatsApp"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                    <button
                      onClick={addManualContact}
                      className="px-3 sm:px-5 py-2.5 sm:py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Tambah</span>
                    </button>
                  </div>
                </div>
              )}

              {inputMode === 'excel' && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm text-blue-400 font-bold mb-0.5">Format Excel</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">Kolom: <span className="text-white font-bold">Nama</span> dan <span className="text-white font-bold">Telepon</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                    <button
                      onClick={downloadExcelTemplate}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 sm:flex-1"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Template
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingExcel}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 sm:flex-1"
                    >
                      {isProcessingExcel ? (
                        <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> Proses...</>
                      ) : (
                        <><Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Upload</>
                      )}
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Contact List */}
              <div className="space-y-1.5 sm:space-y-2 max-h-[220px] sm:max-h-[300px] overflow-y-auto">
                {contacts.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm">Belum ada kontak ditambahkan</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all">
                      <div className="min-w-0">
                        <p className="text-white font-medium text-xs sm:text-sm truncate">{contact.name}</p>
                        <p className="text-gray-500 text-[10px] sm:text-xs">{contact.phone}</p>
                      </div>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded-md sm:rounded-lg transition-all flex-shrink-0 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Template & Send */}
          <div className=" lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Message Template */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-700/50">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">Template Pesan</h3>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900/50 border border-gray-700 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm hover:bg-gray-900 transition-all"
                >
                  <span className="font-medium">{selectedTemplate.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTemplateDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl z-50 overflow-hidden">
                    {MESSAGE_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateDropdown(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm hover:bg-gray-700 transition-colors ${selectedTemplate.id === template.id ? 'bg-pink-500/10 text-pink-500' : 'text-gray-300'}`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-700/50 rounded-xl sm:rounded-2xl max-h-[180px] sm:max-h-[240px] overflow-y-auto">
                <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase font-bold mb-1.5 sm:mb-2">Preview:</p>
                <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed whitespace-pre-line">
                  {selectedInvitation && selectedTemplate.template(
                    '[Nama Tamu]',
                    selectedInvitation.invitationDataUser.groomNickName,
                    selectedInvitation.invitationDataUser.brideNickName,
                    '[Link Undangan]'
                  )}
                </p>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={sendBulkInvitations}
              disabled={contacts.length === 0 || isSending}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 group"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="text-xs sm:text-sm">Mengirim... {sendProgress}%</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs sm:text-sm">Kirim ke {contacts.length} kontak</span>
                </>
              )}
            </button>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <p className="text-yellow-400 text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1">⚠️ Perhatian</p>
              <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed">
                Setiap kontak akan dibuka di tab WhatsApp terpisah. Pastikan browser mengizinkan popup.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
