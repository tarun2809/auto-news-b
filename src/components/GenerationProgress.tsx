import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface Stage {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface GenerationProgressProps {
  currentStage: string;
  progress: number;
  stages: Stage[];
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ 
  currentStage, 
  progress, 
  stages 
}) => {
  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.name === currentStage);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Generating Video</h2>
        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {stages.map((stage, index) => {
            const isComplete = getCurrentStageIndex() > index;
            const isCurrent = getCurrentStageIndex() === index;
            const Icon = stage.icon;

            return (
              <div 
                key={stage.name}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isCurrent ? 'bg-blue-50 border border-blue-200' : 
                  isComplete ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCurrent ? 'bg-blue-100 text-blue-600' :
                  isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-900' :
                    isComplete ? 'text-green-900' : 'text-gray-600'
                  }`}>
                    {stage.name}
                  </p>
                  <p className={`text-xs ${
                    isCurrent ? 'text-blue-600' :
                    isComplete ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stage.description}
                  </p>
                </div>
                {isCurrent && (
                  <div className="text-xs text-blue-600 font-medium">
                    In Progress...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;