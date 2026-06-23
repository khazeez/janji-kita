'use client';
import { InvitationDataUser } from '@/types/interface';
import { Heart, Plus, Trash2, GripVertical } from 'lucide-react';

interface Props {
  data: InvitationDataUser;
  onChange: (data: InvitationDataUser) => void;
}

interface LoveMoment {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function EditorLoveStory({ data, onChange }: Props) {
  const moments: LoveMoment[] = data.loveStory || [];

  const addMoment = () => {
    const newMoments = [
      ...moments,
      { id: `moment_${Date.now()}`, title: '', date: '', description: '' },
    ];
    onChange({ ...data, loveStory: newMoments });
  };

  const updateMoment = (i: number, field: keyof LoveMoment, value: string) => {
    const m = [...moments];
    m[i] = { ...m[i], [field]: value };
    onChange({ ...data, loveStory: m });
  };

  const removeMoment = (i: number) => {
    const m = moments.filter((_, idx) => idx !== i);
    onChange({ ...data, loveStory: m });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
            <Heart size={18} />
          </div>
          Love Story
        </h3>
        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-white/40 font-medium uppercase tracking-wider">
          {moments.length} Momen
        </span>
      </div>

      <p className="text-xs text-white/40 leading-relaxed">
        Ceritakan perjalanan cinta kalian. Setiap momen akan ditampilkan di halaman undangan.
      </p>

      <div className="space-y-4">
        {moments.map((moment, i) => (
          <div
            key={moment.id || i}
            className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                Momen #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeMoment(i)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Judul Momen</label>
              <input
                type="text"
                value={moment.title}
                onChange={(e) => updateMoment(i, 'title', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
                placeholder="First Meeting"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Tanggal</label>
              <input
                type="date"
                value={moment.date}
                onChange={(e) => updateMoment(i, 'date', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Cerita</label>
              <textarea
                value={moment.description}
                onChange={(e) => updateMoment(i, 'description', e.target.value)}
                className="w-full bg-white/[0.05] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all h-20 resize-none"
                placeholder="Ceritakan momen ini..."
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMoment}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-white/10 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-400 py-4 rounded-xl text-sm text-white/30 transition-all group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Tambah Momen
        </button>
      </div>
    </div>
  );
}
