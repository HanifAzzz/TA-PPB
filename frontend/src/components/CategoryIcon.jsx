import { getCategoryInfo } from '../utils/helpers';
import { Cpu, CircuitBoard, Layers, Monitor, HardDrive, Zap, Box, Fan, Package } from 'lucide-react';

const iconMap = {
  Cpu, CircuitBoard, Layers, Monitor, HardDrive, Zap, Box, Fan, Package,
};

export default function CategoryIcon({ category, size = 20, className = '' }) {
  const info = getCategoryInfo(category);
  const IconComp = iconMap[info.icon] || Package;
  return <IconComp size={size} className={`${info.color} ${className}`} />;
}
