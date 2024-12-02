'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const BracketPuzzle = () => {
  const puzzleData = {
    puzzle: "[smallest [[the world's largest [eldest [home of the suns] brother] by volume] service] number]",
    solutions: {
      "home of the suns": "phoenix",
      "eldest phoenix brother": "river",
      "the world's largest river by volume": "amazon",
      "amazon service": "prime",
      "smallest prime number": "2"
    }
  };

  const [currentState, setCurrentState] = useState<string>(puzzleData.puzzle);
  const [solvedParts, setSolvedParts] = useState<Set<string>>(new Set());
  const [userInput, setUserInput] = useState<string>('');
  const [currentBracket, setCurrentBracket] = useState<{content: string; start: number; end: number} | null>(null);
  
  const findInnermostBracket = (text: string) => {
    let depth = 0;
    let maxDepth = 0;
    let innermostStart = -1;
    let innermostEnd = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '[') {
        depth++;
        if (depth > maxDepth) {
          maxDepth = depth;
          innermostStart = i;
        }
      } else if (text[i] === ']') {
        if (depth === maxDepth) {
          innermostEnd = i;
        }
        depth--;
      }
    }
    
    return innermostStart !== -1 ? {
      content: text.substring(innermostStart + 1, innermostEnd),
      start: innermostStart,
      end: innermostEnd
    } : null;
  };

  // Update current bracket on component mount and when state changes
  useEffect(() => {
    const innermost = findInnermostBracket(currentState);
    setCurrentBracket(innermost);
  }, [currentState]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);
    
    if (currentBracket) {
      const userAnswer = newInput.toLowerCase().trim();
      const bracketContent = currentBracket.content;
      
      const correctAnswer = puzzleData.solutions[bracketContent];
      
      if (correctAnswer === userAnswer) {
        setSolvedParts(prev => new Set([...prev, userAnswer]));
        
        const newState = 
          currentState.substring(0, currentBracket.start) +
          userAnswer +
          currentState.substring(currentBracket.end + 1);
        
        setCurrentState(newState);
        setUserInput('');
      }
    }
  };

  const renderPuzzleState = () => {
    let text = currentState;
    let result: JSX.Element[] = [];
    let lastIndex = 0;

    const solutions = Array.from(solvedParts).sort((a, b) => b.length - a.length);
    
    while (lastIndex < text.length) {
      let found = false;
      for (let solution of solutions) {
        const index = text.toLowerCase().indexOf(solution, lastIndex);
        if (index === lastIndex) {
          result.push(
            <span key={lastIndex} className="text-green-600 font-medium">
              {text.substring(lastIndex, lastIndex + solution.length)}
            </span>
          );
          lastIndex += solution.length;
          found = true;
          break;
        }
      }
      if (!found) {
        let nextMatch = text.length;
        for (let solution of solutions) {
          const index = text.toLowerCase().indexOf(solution, lastIndex);
          if (index > -1 && index < nextMatch) {
            nextMatch = index;
          }
        }
        result.push(
          <span key={lastIndex}>
            {text.substring(lastIndex, nextMatch)}
          </span>
        );
        lastIndex = nextMatch;
      }
    }
    return result;
  };

  // Check if puzzle is completely solved by checking for any remaining brackets
  const isSolved = !currentState.includes('[');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Bracket Puzzle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-lg font-medium break-words">
            {renderPuzzleState()}
          </div>
          
          {!isSolved && currentBracket && (
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Solve: [{currentBracket.content}]
              </div>
              <div className="flex gap-4">
                <Input
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  placeholder="Enter your answer..."
                  className="flex-1"
                  autoFocus
                />
              </div>
            </div>
          )}
          
          {isSolved && (
            <div className="text-green-600 font-medium">
              Puzzle solved! The answer is {currentState}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketPuzzle;