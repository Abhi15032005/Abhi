import React, { useState, useMemo } from 'react';

// Placed outside main component to prevent re-creation on every render.
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.591-1.591a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 01-1.06 0l-1.591-1.591a.75.75 0 111.06-1.06l1.591 1.591a.75.75 0 010 1.06zM12 18.75a.75.75 0 01-.75.75v2.25a.75.75 0 011.5 0v-2.25a.75.75 0 01-.75-.75zM6.106 17.894a.75.75 0 010-1.06l1.591-1.591a.75.75 0 111.06 1.06l-1.591 1.591a.75.75 0 01-1.06 0zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM6.106 6.106a.75.75 0 011.06 0l1.591 1.591a.75.75 0 11-1.06 1.06L6.106 7.167a.75.75 0 010-1.06z" />
    </svg>
);

const HumanIcon: React.FC<{ style: React.CSSProperties, className?: string; children?: React.ReactNode }> = ({ style, className, children }) => (
    <div style={style} className={`relative ${className}`}>
        <svg viewBox="0 0 30 80" xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="xMidYMax meet"
            className="w-full h-full"
            fill="currentColor">
            <circle cx="15" cy="7.5" r="7.5" />
            <rect x="5" y="18" width="20" height="62" rx="10" />
        </svg>
        {children}
    </div>
);


function App() {
    const [height, setHeight] = useState<number>(170); // Average human height in cm
    const [time, setTime] = useState<number>(9.5); // 9:30 AM

    // Constants for scaling the visualization
    const MAX_INPUT_HEIGHT = 250; // Max height in cm
    const VISUAL_CONTAINER_HEIGHT = 280; // in pixels
    const OBJECT_WIDTH = 40; // in pixels

    const angle = useMemo(() => {
        // Map time (6 AM to 6 PM) to sun angle (1 to 89 to 1 degrees)
        const noon = 12;
        const hourOffset = Math.abs(time - noon); // 0 at noon, 6 at 6am/6pm
        const maxAngle = 89;
        const minAngle = 1;
        // Simple linear mapping for demonstration
        return maxAngle - (hourOffset / 6) * (maxAngle - minAngle);
    }, [time]);
    
    const shadowLength = useMemo(() => {
        if (angle <= 0) return Infinity;
        if (angle >= 90) return 0;
        const radians = angle * (Math.PI / 180);
        return height / Math.tan(radians);
    }, [height, angle]);
    
    const formattedTime = useMemo(() => {
        const hours = Math.floor(time);
        const minutes = Math.round((time - hours) * 60);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : (hours < 10 && hours !== 0 ? '0'+hours : hours));
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period} IST`;
    }, [time]);

    const visualHeight = (height / MAX_INPUT_HEIGHT) * VISUAL_CONTAINER_HEIGHT;
    const visualShadowLength = isFinite(shadowLength) 
        ? visualHeight / Math.tan(angle * (Math.PI / 180))
        : 5000;

    const hypotenuse = Math.sqrt(visualHeight ** 2 + visualShadowLength ** 2);
    
    return (
        <main className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
                
                {/* Controls Section */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl shadow-2xl space-y-6 h-fit">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan-400">Shadow & Time Calculator</h1>
                        <p className="text-slate-400 mt-2">Adjust the person's height and time of day to see how the shadow length changes.</p>
                    </div>

                    <div className="space-y-6 pt-4">
                        {/* Height Input */}
                        <div>
                            <label htmlFor="height" className="flex justify-between text-sm font-medium text-slate-300">
                                <span>Object Height</span>
                                <span className="text-cyan-400 font-semibold">{height.toFixed(0)} cm</span>
                            </label>
                            <input
                                id="height"
                                type="range"
                                min="50"
                                max={MAX_INPUT_HEIGHT}
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 mt-2"
                                aria-label="Object height slider"
                            />
                        </div>
                        {/* Time Input */}
                        <div>
                            <label htmlFor="time" className="flex justify-between text-sm font-medium text-slate-300">
                                <span>Time of Day</span>
                                 <span className="text-cyan-400 font-semibold">{formattedTime}</span>
                            </label>
                            <input
                                id="time"
                                type="range"
                                min="6"
                                max="18"
                                step="0.25"
                                value={time}
                                onChange={(e) => setTime(Number(e.target.value))}
                                className="w-full h-2 mt-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                aria-label="Time of day slider"
                            />
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className="bg-slate-900/70 border border-slate-700 p-4 rounded-lg text-center mt-4 space-y-4">
                         <div>
                            <p className="text-slate-400 text-sm tracking-wider uppercase">Approximate Time</p>
                             <p className="text-2xl font-semibold text-cyan-300 mt-1">{formattedTime}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm tracking-wider uppercase">Calculated Shadow Length</p>
                            <p className="text-4xl font-semibold text-cyan-300 mt-1">
                                {shadowLength === Infinity ? '∞' : shadowLength.toFixed(2)}
                                <span className="text-xl text-slate-400 ml-2">cm</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visualization Section */}
                <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center justify-center min-h-[450px] overflow-hidden">
                    <div className="w-full h-96 relative">
                         {/* Sun */}
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out" style={{transform: `rotate(${90-angle}deg)`}}>
                           <div className='transform -translate-y-48'>
                             <SunIcon className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.7)]" />
                           </div>
                        </div>

                        {/* Scene Container */}
                        <div className="absolute inset-0 flex items-end justify-center">
                            <div className="w-[90%] h-80 relative">
                                {/* Ground */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600 rounded-full" />
                                
                                {/* Object and Shadow Group */}
                                <div className="absolute bottom-1 left-[10%] flex items-end">
                                    {/* Object */}
                                    <HumanIcon
                                        className="text-cyan-500 z-10 origin-bottom transition-all duration-300"
                                        style={{ height: `${visualHeight}px`, width: `${OBJECT_WIDTH}px` }}
                                    >
                                        {/* Sunbeam */}
                                        {isFinite(shadowLength) && shadowLength > 0 && angle < 90 && (
                                            <div
                                                className="absolute top-0 left-1/2 h-px bg-yellow-300/50 origin-top-left transition-all duration-300 ease-out"
                                                style={{
                                                    width: `${hypotenuse}px`,
                                                    transform: `rotate(${-(angle)}deg) translateX(-${OBJECT_WIDTH/2}px) translateY(${visualHeight * 0.1}px)`
                                                }}
                                            />
                                        )}
                                    </HumanIcon>

                                    {/* Shadow */}
                                    <div
                                        className="h-6 bg-slate-300/80 rounded-full transition-all duration-300 ease-out relative -ml-5 blur-md"
                                        style={{ width: `${visualShadowLength}px` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
