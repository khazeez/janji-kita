'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Download, 
  Loader2,
  ChevronDown,
} from 'lucide-react';
import supabase from '@/lib/supabase/client';
import { getDataInvitationUserByUserId, getGuestBook } from '@/models/invitations';
import { GuestBook, AllInvitationData } from '@/types/interface';

export default function GuestManagement() {
  const [invitations, setInvitations] = useState<AllInvitationData[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<AllInvitationData | null>(null);
  const [guests, setGuests] = useState<GuestBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingGuests, setFetchingGuests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'>('ALL');
  const [showInvitationDropdown, setShowInvitationDropdown] = useState(false);

  useEffect(() => {
    async function loadInvitations() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        const data = await getDataInvitationUserByUserId(session.user.id);
        if (data && Array.isArray(data) && data.length > 0) {
          setInvitations(data);
          setSelectedInvitation(data[0]);
        }
      }
      setLoading(false);
    }
    loadInvitations();
  }, []);

  useEffect(() => {
    async function loadGuests() {
      if (!selectedInvitation) return;
      
      setFetchingGuests(true);
      const result = await getGuestBook(selectedInvitation.invitationId);
      if (result.success) {
        setGuests(result.data || []);
      } else {
        setGuests([]);
      }
      setFetchingGuests(false);
    }
    loadGuests();
  }, [selectedInvitation]);

  const stats = {
    total: guests.length,
    attending: guests.filter(g => g.attendanceStatus === 'ATTENDING').length,
    notAttending: guests.filter(g => g.attendanceStatus === 'NOT_ATTENDING').length,
    maybe: guests.filter(g => g.attendanceStatus === 'MAYBE').length,
    totalPax: guests.reduce((acc, curr) => acc + (curr.guestCount || 0), 0)
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || guest.attendanceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ATTENDING':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'NOT_ATTENDING':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'MAYBE':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ATTENDING': return 'Hadir';
      case 'NOT_ATTENDING': return 'Tidak Hadir';
      case 'MAYBE': return 'Ragu-ragu';
      default: return status;
    }
  };

  const formatStatusShort = (status: string) => {
    switch (status) {
      case 'ATTENDING': return 'Hadir';
      case 'NOT_ATTENDING': return 'Absen';
      case 'MAYBE': return 'Ragu';
      default: return status;
    }
  };

  const exportToCSV = () => {
    const headers = ['Nama Tamu', 'Status', 'Jumlah Pax', 'Pesan', 'Waktu RSVP'];
    const rows = filteredGuests.map(guest => [
      guest.guestName,
      formatStatus(guest.attendanceStatus),
      guest.guestCount.toString(),
      guest.message || '-',
      new Date(guest.createdAt).toLocaleString('id-ID')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `daftar-tamu-${selectedInvitation?.invitationUrl || 'export'}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto" />
          <p className="text-gray-400 text-xs">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">Data Kehadiran</h1>
          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">Kelola daftar kehadiran tamu undanganmu.</p>
        </div>

        {/* Invitation Selector */}
        {invitations.length > 0 && (
          <div className="relative">
            <button 
              onClick={() => setShowInvitationDropdown(!showInvitationDropdown)}
              className="w-full sm:w-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-white hover:bg-gray-750 transition-all sm:min-w-[220px] justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">
                  {selectedInvitation ? `${selectedInvitation.invitationDataUser.groomNickName} & ${selectedInvitation.invitationDataUser.brideNickName}` : 'Pilih Undangan'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${showInvitationDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showInvitationDropdown && (
              <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-1 w-full sm:w-auto sm:min-w-[220px] bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl shadow-2xl z-50 overflow-hidden">
                {invitations.map((inv) => (
                  <button
                    key={inv.invitationId}
                    onClick={() => {
                      setSelectedInvitation(inv);
                      setShowInvitationDropdown(false);
                    }}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm hover:bg-gray-700 transition-colors flex items-center gap-2 sm:gap-3 ${selectedInvitation?.invitationId === inv.invitationId ? 'bg-pink-500/10 text-pink-500' : 'text-gray-300'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedInvitation?.invitationId === inv.invitationId ? 'bg-pink-500' : 'bg-gray-600'}`} />
                    <span className="truncate">{inv.invitationDataUser.groomNickName} & {inv.invitationDataUser.brideNickName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!selectedInvitation ? (
        <div className="bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">Belum ada undangan</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Buat undangan terlebih dahulu untuk mengelola tamu.</p>
          <button 
            onClick={() => window.location.href = '/dashboard/catalogue'}
            className="bg-pink-600 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-pink-500 transition-all"
          >
            Buat Undangan Sekarang
          </button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Total RSVP</p>
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gray-600" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500">Est. {stats.totalPax} orang</p>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-green-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Hadir</p>
                <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-green-500" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-500">{stats.attending}</p>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-red-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Tidak Hadir</p>
                <UserX className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-red-500" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500">{stats.notAttending}</p>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-yellow-500/70 text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wider">Ragu</p>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 border-2 border-yellow-500/40 rounded-full" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-500">{stats.maybe}</p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            {/* Toolbar */}
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-700/50 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-between items-stretch sm:items-center">
              <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Cari nama tamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ATTENDING">Hadir</option>
                  <option value="NOT_ATTENDING">Tidak Hadir</option>
                  <option value="MAYBE">Ragu-ragu</option>
                </select>

                <button 
                  onClick={exportToCSV}
                  className="p-2 sm:p-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg sm:rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {fetchingGuests ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 text-pink-500 animate-spin mx-auto mb-3" />
                  <p className="text-gray-500 text-xs">Memuat data tamu...</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="bg-gray-900/50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  <p className="text-gray-400 font-medium text-sm">Belum ada data tamu</p>
                  <p className="text-gray-600 text-[10px] mt-1">Tamu yang mengisi RSVP akan muncul di sini.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {filteredGuests.map((guest) => (
                    <div key={guest.guestId} className="p-3 hover:bg-gray-700/20 transition-colors">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-500 font-bold text-xs flex-shrink-0">
                          {guest.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">{guest.guestName}</p>
                          <p className="text-[10px] text-gray-500">
                            {new Date(guest.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border flex-shrink-0 ${getStatusStyle(guest.attendanceStatus)}`}>
                          {formatStatusShort(guest.attendanceStatus)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pl-[42px] text-[10px]">
                        <span className="text-gray-400">{guest.guestCount} orang</span>
                        {guest.message && (
                          <>
                            <span className="text-gray-700">•</span>
                            <p className="text-gray-500 truncate">{guest.message}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/30">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">Tamu</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Pesan</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {fetchingGuests ? (
                    <tr>
                      <td colSpan={5} className="px-4 lg:px-6 py-16 lg:py-20 text-center">
                        <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 text-pink-500 animate-spin mx-auto mb-3 lg:mb-4" />
                        <p className="text-gray-500 text-xs sm:text-sm">Memuat data tamu...</p>
                      </td>
                    </tr>
                  ) : filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 lg:px-6 py-16 lg:py-20 text-center">
                        <div className="bg-gray-900/50 w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                        </div>
                        <p className="text-gray-400 font-medium text-sm">Belum ada data tamu</p>
                        <p className="text-gray-600 text-xs mt-1">Tamu yang mengisi RSVP akan muncul di sini.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr key={guest.guestId} className="hover:bg-gray-700/20 transition-colors group">
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5 lg:gap-3">
                            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-500 font-bold text-[10px] lg:text-sm flex-shrink-0">
                              {guest.guestName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs lg:text-sm font-semibold text-white">{guest.guestName}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className={`px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[9px] lg:text-[10px] font-bold uppercase border ${getStatusStyle(guest.attendanceStatus)}`}>
                            {formatStatus(guest.attendanceStatus)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className="text-xs lg:text-sm text-gray-300 font-medium">{guest.guestCount} Orang</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 hidden md:table-cell">
                          <p className="text-xs lg:text-sm text-gray-400 line-clamp-1 max-w-[160px] lg:max-w-[200px]" title={guest.message}>
                            {guest.message || '-'}
                          </p>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className="text-[10px] lg:text-xs text-gray-500">
                            {new Date(guest.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 bg-gray-900/30 border-t border-gray-700/50 flex justify-between items-center">
              <p className="text-[10px] sm:text-xs text-gray-500">
                Menampilkan <span className="font-bold text-white">{filteredGuests.length}</span> dari <span className="font-bold text-white">{guests.length}</span> tamu
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
