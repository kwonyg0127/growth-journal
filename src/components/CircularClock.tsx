import { getCategoryColor } from '@/constants/categories';
import { Plan } from '@/types/plan';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIZE = (SCREEN_WIDTH - 24) * 0.9; 
const CENTER = SIZE / 2;
const OUTER_RADIUS = CENTER - 30;
const INNER_RADIUS = OUTER_RADIUS * 0.55; 

const HOUR_LABELS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

const polarToCartesian = (center: number, angleDeg: number, r: number) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
};

const describeDonutArc = (center: number, startAngle: number, endAngle: number, outerR: number, innerR: number) => {
  let safeEndAngle = endAngle;
  if (safeEndAngle - startAngle < 6 && safeEndAngle >= startAngle) {
    safeEndAngle = startAngle + 6;
  }

  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (safeEndAngle - 90) * (Math.PI / 180);

  const outerStart = { x: center + outerR * Math.cos(startRad), y: center + outerR * Math.sin(startRad) };
  const outerEnd = { x: center + outerR * Math.cos(endRad), y: center + outerR * Math.sin(endRad) };
  const innerStart = { x: center + innerR * Math.cos(startRad), y: center + innerR * Math.sin(startRad) };
  const innerEnd = { x: center + innerR * Math.cos(endRad), y: center + innerR * Math.sin(endRad) };

  const largeArc = safeEndAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
};

type Props = {
  plans: Plan[];
  period: 'AM' | 'PM';
  title: string; // 🔥 추가된 부분: 원 중앙에 들어갈 텍스트
  onPlanPress?: (plan: Plan) => void;
};

export default function CircularClock({ plans, period, title, onPlanPress }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeToAngle = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return (h % 12) * 30 + m * 0.5;
  };

  const currentH = now.getHours();
  const isNowPM = currentH >= 12;
  let currentAngle = -1;
  
  if (period === 'AM' && !isNowPM) {
    currentAngle = (currentH % 12) * 30 + now.getMinutes() * 0.5;
  } else if (period === 'PM' && isNowPM) {
    currentAngle = (currentH % 12) * 30 + now.getMinutes() * 0.5;
  }

  const arrowTip = currentAngle >= 0 ? polarToCartesian(CENTER, currentAngle, OUTER_RADIUS - 5) : null;

  return (
    <Svg width={SIZE} height={SIZE}>
      <Circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} stroke="#E5E7EB" strokeWidth={2} fill="none" />

      {Array.from({ length: 12 }).map((_, i) => {
        const outer = polarToCartesian(CENTER, i * 30, OUTER_RADIUS);
        const inner = polarToCartesian(CENTER, i * 30, OUTER_RADIUS - 10);
        return <Line key={i} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="#9CA3AF" strokeWidth={2} />;
      })}

      <Line x1={polarToCartesian(CENTER, 0, OUTER_RADIUS).x} y1={polarToCartesian(CENTER, 0, OUTER_RADIUS).y} x2={polarToCartesian(CENTER, 180, OUTER_RADIUS).x} y2={polarToCartesian(CENTER, 180, OUTER_RADIUS).y} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4,4" />
      <Line x1={polarToCartesian(CENTER, 90, OUTER_RADIUS).x} y1={polarToCartesian(CENTER, 90, OUTER_RADIUS).y} x2={polarToCartesian(CENTER, 270, OUTER_RADIUS).x} y2={polarToCartesian(CENTER, 270, OUTER_RADIUS).y} stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4,4" />

      {plans.map((plan) => {
        const [startH, startM] = plan.startTime.split(':').map(Number);
        const [endH, endM] = plan.endTime.split(':').map(Number);
        let sMin = startH * 60 + startM;
        let eMin = endH * 60 + endM;
        if (eMin <= sMin) eMin += 1440; 

        let drawStart = -1;
        let drawEnd = -1;

        if (period === 'AM') {
          drawStart = Math.max(sMin, 0);
          drawEnd = Math.min(eMin, 720);
        } else {
          drawStart = Math.max(sMin, 720);
          drawEnd = Math.min(eMin, 1440);
        }

        if (drawStart < drawEnd) {
          const startAngle = timeToAngle(`${Math.floor((drawStart % 720) / 60)}:${(drawStart % 60)}`);
          const endAngle = timeToAngle(`${Math.floor((drawEnd % 720) / 60)}:${(drawEnd % 60)}`);
          const color = getCategoryColor(plan.category);

          return (
            <Path
              key={plan.id}
              d={describeDonutArc(CENTER, startAngle, endAngle, OUTER_RADIUS, INNER_RADIUS)}
              fill={color.bg}
              stroke={color.text}
              strokeWidth={1}
              onPress={() => onPlanPress?.(plan)}
            />
          );
        }
        return null;
      })}

      {arrowTip && currentAngle >= 0 && (
        <>
          <Line x1={CENTER} y1={CENTER} x2={arrowTip.x} y2={arrowTip.y} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
          <Circle cx={CENTER} cy={CENTER} r={4} fill="#EF4444" />
        </>
      )}

      {Array.from({ length: 12 }).map((_, i) => {
        const pos = polarToCartesian(CENTER, i * 30, OUTER_RADIUS + 20);
        return (
          <SvgText key={i} x={pos.x} y={pos.y} fontSize={14} fill="#6B7280" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
            {HOUR_LABELS[i]}
          </SvgText>
        );
      })}

      {/* 🔥 추가된 부분: 원 중앙의 텍스트 */}
      <SvgText 
        x={CENTER} 
        y={CENTER} 
        fontSize={24} 
        fill="#2E7D32" 
        fontWeight="bold" 
        textAnchor="middle" 
        alignmentBaseline="middle"
      >
        {title}
      </SvgText>
    </Svg>
  );
}