import React from 'react';

interface AnalysisResultProps {
  result: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  // Simple markdown to HTML conversion
  const formatResult = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**Section 1')) {
          return `<h4 class="text-lg font-semibold text-primary-700 mt-4 mb-2" key=${index}>${line.replace(/\*\*/g, '')}</h4>`;
        }
        if (line.startsWith('**Section 2')) {
          return `<h4 class="text-lg font-semibold text-primary-700 mt-6 mb-2" key=${index}>${line.replace(/\*\*/g, '')}</h4>`;
        }
        if (line.startsWith('- ')) {
          return `<li class="ml-5 mb-2 list-disc text-gray-700" key=${index}>${line.substring(2)}</li>`;
        }
        if (line.trim() === '') {
            return `<br key=${index} />`
        }
        return `<p class="mb-3 text-gray-700" key=${index}>${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="mt-6">
      <div className="space-y-2" dangerouslySetInnerHTML={{ __html: formatResult(result) }} />
    </div>
  );
};