import React from 'react';

type StatSelectorSliderProps = {
	value: number;
	maxPossible: number;
	onChange: (value: number) => void;
};

const SLIDER_MAX = 200;

const StatSelectorSlider: React.FC<StatSelectorSliderProps> = ({
	value,
	maxPossible,
	onChange,
}) => {
	// Clamp value to [0, SLIDER_MAX]
	const clampedValue = Math.max(0, Math.min(value, SLIDER_MAX));

	// Calculate percentage for fill and dark overlay
	const fillPercent = (clampedValue / SLIDER_MAX) * 100;
	const darkPercent = (maxPossible / SLIDER_MAX) * 100;

	return (
		<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
			<div style={{ flex: 1, position: 'relative', height: 32 }}>
				{/* Slider track */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: '50%',
						transform: 'translateY(-50%)',
						width: '100%',
						height: 8,
						borderRadius: 4,
						background: '#444',
						overflow: 'hidden',
					}}
				>
					{/* Overlay for maxPossible */}
					<div
						style={{
							position: 'absolute',
							left: `${darkPercent}%`,
							top: 0,
							width: `${100 - darkPercent}%`,
							height: '100%',
							background: 'rgba(0,0,0,0.5)',
							pointerEvents: 'none',
						}}
					/>
					{/* Fill for selected value */}
					<div
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							width: `${fillPercent}%`,
							height: '100%',
							background: '#fff',
							opacity: 0.7,
							pointerEvents: 'none',
						}}
					/>
				</div>
				{/* Slider input */}
				<input
					type="range"
					min={0}
					max={SLIDER_MAX}
					value={clampedValue}
					onChange={(e) => onChange(Number(e.target.value))}
					style={{
						position: 'relative',
						width: '100%',
						height: 32,
						background: 'transparent',
						zIndex: 1,
						WebkitAppearance: 'none',
						appearance: 'none',
					}}
				/>
			</div>
			{/* Value label, spaced to the right of the slider */}
			<div
				style={{
					marginLeft: 16,
					minWidth: 32,
					textAlign: 'center',
					color: '#fff',
				}}
			>
				{clampedValue}
			</div>
		</div>
	);
};

export default StatSelectorSlider;
