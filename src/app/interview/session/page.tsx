'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InterviewSession() {
  const router = useRouter();
  const [name, setName] = useState('Candidate');
  const [email, setEmail] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const questions = [
    'Tell me about yourself and your background.',
    'What are your key strengths and how have you applied them?',
    'Describe a challenging situation you faced and how you handled it.',
    'Where do you see yourself in 5 years?',
    'Why are you interested in this opportunity?',
    'Do you have any questions for me?',
  ];

  useEffect(() => {
    // Get params from URL using window.location
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      const emailParam = params.get('email');
      if (nameParam) setName(nameParam);
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    setIsProcessing(true);
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer('');
    } else {
      setIsComplete(true);
    }
    setIsProcessing(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const saveTranscript = async () => {
    try {
      let transcript = '';
      for (let i = 0; i < answers.length; i++) {
        transcript = transcript + 'Q' + (i + 1) + ': ' + questions[i] + '\n' + 'A: ' + answers[i] + '\n\n';
      }

      const response = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          transcript: transcript,
          questionCount: answers.length,
        }),
      });

      if (response.ok) {
        router.push('/thank-you?name=' + encodeURIComponent(name));
      } else {
        alert('Error saving transcript. Please try again.');
      }
    } catch (error) {
      alert('Error saving transcript. Please try again.');
    }
  };

  if (isComplete) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold">Interview Complete!</h1>
          <p className="mt-2 text-slate-400">Thank you, {name}!</p>
          <p className="mt-4 text-slate-400 text-sm">
            {answers.length} responses recorded
          </p>
          <button
            onClick={saveTranscript}
            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500 transition"
          >
            Submit & Save
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-slate-500">AI Interview</p>
            <h2 className="text-2xl font-bold">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
          </div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={'w-2 h-2 rounded-full ' + (i <= currentQuestion ? 'bg-blue-500' : 'bg-slate-700')}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl shrink-0">
              🤖
            </div>
            <div>
              <p className="text-sm text-slate-400">AI Interviewer</p>
              <p className="text-lg mt-1">{questions[currentQuestion]}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-slate-400">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={(e: any) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here... (Press Enter to submit)"
              rows={4}
              disabled={isProcessing}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleNext}
            disabled={!currentAnswer.trim() || isProcessing}
            className={
              'mt-6 w-full rounded-xl px-5 py-4 font-semibold transition ' +
              (currentAnswer.trim() && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed')
            }
          >
            {isProcessing ? 'Processing...' : currentQuestion === questions.length - 1 ? 'Complete Interview →' : 'Next Question →'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Press Enter to submit your answer
          </p>
        </div>
      </div>
    </main>
  );
}

