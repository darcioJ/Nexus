import mongoose, { Schema, Document } from 'mongoose';

export interface IArchive extends Document {
  title: string;
  category: 'LORE' | 'REGRAS' | 'LOGS' | 'SISTEMA';
  previewText: string;
  content: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ArchiveSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['LORE', 'REGRAS', 'LOGS', 'SISTEMA'],
    default: 'LORE'
  },
  previewText: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: String, default: 'Mestre_Nexus' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IArchive>('Archive', ArchiveSchema);