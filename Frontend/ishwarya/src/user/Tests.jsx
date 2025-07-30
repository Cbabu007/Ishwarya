import React, { useState, useEffect, useRef } from 'react';
import './Tests.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Tests() {
  const [step, setStep] = useState('testname'); // testname | writetest | results
  const [started, setStarted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [launched, setLaunched] = useState([false, false, false]);
  const [testList, setTestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  // const [submitted, setSubmitted] = useState(false);

  // New states for questions and navigation
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Result popup state
  const [showResultChart, setShowResultChart] = useState(false);
  const [resultData, setResultData] = useState({ correct: 0, wrong: 0, skipped: 0, totalScore: 0 });
  const [showInstructions, setShowInstructions] = useState(true); // true initially
  const [okDisabled, setOkDisabled] = useState(false); // Add this line
  const [reviewData, setReviewData] = useState([]);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const username = loginData.username || "";
  const password = loginData.password || "";
  

  // Remove duplicate test names

  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const res = await fetch('https://localhost:7248/api/user/WriteTest/by-login', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();

          // Group questions by testName + testNo + language (unique test key)
          const testMap = {};
          data.forEach(q => {
            const key = `${q.testName}|${q.testNo}|${q.language}`;
            if (!testMap[key]) {
              testMap[key] = {
                id: q.id,
                course: q.course,
                testName: q.testName,
                subject: q.subject,
                topic: q.topic,
                testNo: q.testNo,
                language: q.language,
                date: q.date,
                timing: q.timing,
                questions: []
              };
            }
            testMap[key].questions.push({
              questionNo: q.questionNo,
              question: q.question,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              answer: q.answer,
              type: q.type,
              timing: q.timing,
              date: q.date
            });
          });

          // Sort questions by questionNo for each test
          Object.values(testMap).forEach(test => {
            test.questions.sort((a, b) => Number(a.questionNo) - Number(b.questionNo));
          });

          setTestList(Object.values(testMap));
        }
      } catch {
        // handle error
      }
      setLoading(false);
    }
    fetchTests();
  }, [username, password]);

  // Start timer when test is started
  useEffect(() => {
    if (step === 'results' && started && selectedTest) {
      const totalSeconds = parseInt(selectedTest.timing, 10);
      setTimeLeft(totalSeconds * 60);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            
            // Mark all unanswered questions as skipped before auto-submit
            setQuestions(prevQuestions => {
              const updatedQuestions = prevQuestions.map(q => {
                // If question has no selected answer, mark as skipped
                if (!q.selected || q.selected === '') {
                  return { ...q, status: 'skipped', selected: 'E' };
                }
                return q;
              });
              
              // Auto-submit with updated questions
              setTimeout(() => {
                handleSubmit(true, updatedQuestions);
              }, 100);
              
              return updatedQuestions;
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, started, selectedTest]);

  // Initialize questions when test is started
  useEffect(() => {
    if (started && selectedTest && selectedTest.questions) {
      setQuestions(
        selectedTest.questions.map((q, i) => ({
          ...q,
          status: i === 0 ? 'not-answered' : 'not-visited'
        }))
      );
      setCurrentQIndex(0);
      setSelectedOption('');
    }
  }, [started, selectedTest]);

  // Calculate result as per course logic
  function calculateResult(questions, course) {
    let correct = 0, wrong = 0, skipped = 0;
    let correctMark = 1, wrongPenalty = 0;

    switch (course?.toUpperCase()) {
      case 'TNPSC':
        correctMark = 1.5;
        wrongPenalty = 0;
        break;
      case 'BANK':
        correctMark = 1;
        wrongPenalty = 0.25;
        break;
      case 'RRB':
        correctMark = 1;
        wrongPenalty = 0.33;
        break;
      case 'UPSC':
        correctMark = 2;
        wrongPenalty = 0.66;
        break;
      case 'SSC':
        correctMark = 2;
        wrongPenalty = 0.5;
        break;
      default:
        correctMark = 1;
        wrongPenalty = 0;
        break;
    }

    questions.forEach(q => {
      if (!q.selected || q.selected === 'E') skipped++;
      else if (q.selected === q.answer) correct++;
      else wrong++;
    });

    const totalScore = parseFloat(((correct * correctMark) - (wrong * wrongPenalty)).toFixed(2));

    return {
      correct,
      wrong,
      skipped,
      totalScore
    };
  }

  // Save answer and move to next
  const saveAnswer = () => {
    if (!questions.length) return;

    const q = questions[currentQIndex];

    // If already saved twice, block
    if (q.savedCount >= 2) {
      alert("You have already changed this answer once. You can't update it again.");
      return;
    }

    // Skip saving if no answer selected
    if (!selectedOption) return;

    setQuestions(prev =>
      prev.map((item, idx) => {
        if (idx === currentQIndex) {
          const newCount = (item.savedCount || 0) + 1;
          return {
            ...item,
            status: 'answered',
            selected: selectedOption,
            savedCount: newCount
          };
        }
        return item;
      })
    );

    // Move to next
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(questions[currentQIndex + 1]?.selected || '');
    }
  };

  // Mark question
  const markQuestion = () => {
    setQuestions(prev =>
      prev.map((item, idx) =>
        idx === currentQIndex ? { ...item, status: 'marked' } : item
      )
    );
    // Move to next question if not last
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(questions[currentQIndex + 1]?.selected || '');
    }
  };

  const goToQuestion = (idx) => {
    setCurrentQIndex(idx);
    setSelectedOption(questions[idx]?.selected || '');
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      const newIndex = currentQIndex - 1;
      setCurrentQIndex(newIndex);
      setSelectedOption(questions[newIndex]?.selected || '');
    }
  };

  const formatMinutes = (mins) => {
    if (!mins) return '--';
    const m = parseInt(mins, 10);
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? `${h} Hours ${mm} Minutes` : `${mm} Minutes`;
  };

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  // Final handleSubmit with result calculation and popup
  const handleSubmit = async (auto = false, questionsToSubmit = null) => {
    const finalQuestions = questionsToSubmit || questions;
    
    // If not auto, block submit if any question not answered
    if (!auto) {
      const notAnswered = finalQuestions.find(q => !q.selected);
      if (notAnswered) {
        alert(`Question No ${notAnswered.questionNo} not selecting`);
        return;
      }
    }

    // If auto-submit due to time over, mark remaining as skipped
    if (auto && !questionsToSubmit) {
      setQuestions(prev => 
        prev.map(q => {
          if (!q.selected || q.selected === '') {
            return { ...q, status: 'skipped', selected: 'E' };
          }
          return q;
        })
      );
    }

    // Submit all questions
    for (const q of finalQuestions) {
      const formData = new FormData();
      formData.append('Username', username);
      formData.append('TestName', selectedTest.testName);
      formData.append('Subject', selectedTest.subject);
      formData.append('Topic', selectedTest.topic);
      formData.append('TestNo', selectedTest.testNo);
      formData.append('Language', selectedTest.language);
      formData.append('Date', selectedTest.date);
      formData.append('QuestionNo', q.questionNo);
      formData.append('AnswerText', q.selected ? q.selected : "E");

      await fetch('https://localhost:7248/api/user/writetest/save-answer', {
        method: 'POST',
        body: formData
      });
    }

    localStorage.setItem(
      `submitted_${username}_${selectedTest.testName}_${selectedTest.testNo}`,
      'true'
    );
    
    setStarted(false);
    setLaunched([false, false, false]);
    
    // Calculate result and show chart
    const result = calculateResult(finalQuestions, selectedTest.course);
    setResultData(result);
    setShowResultChart(true);
  };

  // Pie chart colors
  const COLORS = ['#00FF00', '#FF0000', '#800080'];

  // Auto-submit result when result chart is shown
  useEffect(() => {
    // Only run when result chart is shown
    if (showResultChart && selectedTest && resultData && !okDisabled) {
      setOkDisabled(true); // Prevent double submit
      const formData = new FormData();
      formData.append('Username', username);
      formData.append('Password', password);
      formData.append('Course', selectedTest.course);
      formData.append('TestName', selectedTest.testName);
      formData.append('Subject', selectedTest.subject);
      formData.append('Topic', selectedTest.topic);
      formData.append('TestNo', selectedTest.testNo);
      formData.append('Language', selectedTest.language);
      formData.append('Date', selectedTest.date);
      formData.append('Correct', resultData.correct);
      formData.append('Wrong', resultData.wrong);
      formData.append('Skipped', resultData.skipped);
      formData.append('TotalScore', resultData.totalScore);

      fetch('https://localhost:7248/api/user/writetest/save-result', {
        method: 'POST',
        body: formData
      }).then(() => {
        // Optionally show a toast or set a flag if needed
      });
    }
    // eslint-disable-next-line
  }, [showResultChart, selectedTest, resultData, okDisabled]);

  const handleReview = async (test) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('testName', test.testName);
    formData.append('testNo', test.testNo);

    const res = await fetch('https://localhost:7248/api/user/writetest/fetch-review', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      setReviewData(data);
      setStep('review');
    }
  };

  // --- Add this function below handleReview ---
  const handleDownloadPDF = async (test, type) => {
    const formData = new FormData();
    formData.append("testName", test.testName);
    formData.append("subject", test.subject);
    formData.append("topic", test.topic);
    formData.append("testNo", test.testNo);

    const res = await fetch('https://localhost:7248/api/user/WriteTest/get-papers', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      let pdfUrl = type === 'question' ? data.questionPdf : data.answerPdf;
      pdfUrl = getBackendFileUrl(pdfUrl);

      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        alert("PDF not available");
      }
    } else {
      alert("PDF not found");
    }
  };

  // When rendering or downloading files, always use the full backend URL:
  const getBackendFileUrl = (relativePath) => {
    if (!relativePath) return '';
    // Normalize slashes
    let cleanPath = relativePath.replace(/\\/g, '/');
    // Remove duplicate /uploads if present
    cleanPath = cleanPath.replace(/^\/?uploads\/uploads/, '/uploads');
    // Ensure single leading slash
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    // Prepend backend base URL
    return `https://localhost:7248${cleanPath}`;
  };

  const handleVideo = async (test) => {
    const formData = new FormData();
    formData.append("course", test.course);
    formData.append("testName", test.testName);
    formData.append("subject", test.subject);
    formData.append("topic", test.topic);
    formData.append("testNo", test.testNo);

    try {
      const res = await fetch('https://localhost:7248/api/user/WriteTest/get-exam-video', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        let videoPath = data.video;
        const fullVideoUrl = getBackendFileUrl(videoPath);

        if (fullVideoUrl) {
          setVideoUrl(fullVideoUrl);
          setShowVideoPreview(true);
        } else {
          alert("Video not available");
        }
      } else {
        alert("Video not found");
      }
    } catch {
      alert("Error loading video");
    }
  };

  function canLaunchTest(test) {
    if (!test.date) return false;
    const testDate = new Date(test.date);
    // Set testDate to 9:00 AM of the test day
    testDate.setHours(9, 0, 0, 0);
    const now = new Date();
    // Allow launch any time after 9:00 AM on the test date
    return now >= testDate;
  }

  return (
    <div className="page-content">
      {step === 'testname' && (
        <div className="frame-box">
          {loading ? (
            <div>Loading...</div>
          ) : (
            Array.from(
              new Map(testList.map(test => [test.testName, test])).values()
            ).map((test) => (
              <div
                className="nav-card"
                key={test.testName}
                onClick={() => {
                  const testsForName = testList.filter(t => t.testName === test.testName);
                  setSelectedTest(testsForName);
                  setStep('writetest');
                }}
              >
                {test.testName} <span style={{fontSize:12, color:'#888'}}>({test.course})</span>
              </div>
            )) // <-- This parenthesis closes the .map!
          )}
        </div>
      )}

      {step === 'writetest' && selectedTest && (
        <div className="test-main-box">
          {/* Group tests by testNo and show language selection */}
          {Array.from(
            new Map(selectedTest.map(test => [test.testNo, test])).values()
          )
            .sort((a, b) => Number(a.testNo) - Number(b.testNo))
            .map((testGroup) => {
              // Get all languages for this test number
              const allLanguagesForTest = selectedTest.filter(t => t.testNo === testGroup.testNo);
              
              const isAnyLanguageSubmitted = allLanguagesForTest.some(test => 
                localStorage.getItem(`submitted_${username}_${test.testName}_${test.testNo}`) === 'true'
              );

              return (
                <div className="test-entry" key={testGroup.testNo}>
                  <div className="test-labels">
                    <p><span className="label-bold">Test No. :</span> {testGroup.testNo}</p>
                    <p><span className="label-bold">Subject :</span> {testGroup.subject}</p>
                    <p><span className="label-bold">Topic :</span> {testGroup.topic}</p>
                    <p><span className="label-bold">Timing :</span> {formatMinutes(testGroup.timing)}</p>
                    
                    {/* Show available languages */}
                    <p><span className="label-bold">Languages :</span> {allLanguagesForTest.map(t => t.language).join(', ')}</p>

                    {/* After submission buttons */}
                    {isAnyLanguageSubmitted && (
                      <div className="after-launch-btns">
                        <button className="blue-btn" onClick={() => handleReview(allLanguagesForTest[0])}>Preview</button>
                        <button className="blue-btn" onClick={() => handleDownloadPDF(allLanguagesForTest[0], 'question')}>Question</button>
                        <button className="blue-btn" onClick={() => handleDownloadPDF(allLanguagesForTest[0], 'answer')}>Answer</button>
                        <button className="blue-btn" onClick={() => handleVideo(allLanguagesForTest[0])}>Video</button>
                      </div>
                    )}
                  </div>

                  {/* Language selection and Launch button */}
                  {!isAnyLanguageSubmitted && (
                    <div className="language-launch-section">
                      <div className="language-selection">
                        <label className="language-label">Choose Language:</label>
                        <select 
                          className="language-select"
                          defaultValue=""
                          onChange={(e) => {
                            const selectedLanguage = e.target.value;
                            if (selectedLanguage) {
                              const selectedTestForLanguage = allLanguagesForTest.find(t => t.language === selectedLanguage);
                              if (selectedTestForLanguage && canLaunchTest(selectedTestForLanguage)) {
                                setLaunched([true, ...launched.slice(1)]);
                                setSelectedTest(selectedTestForLanguage);
                                setStep('results');
                              }
                            }
                          }}
                        >
                          <option value="">Select Language</option>
                          {allLanguagesForTest.map(test => (
                            <option 
                              key={test.language} 
                              value={test.language}
                              disabled={!canLaunchTest(test)}
                            >
                              {test.language}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <hr className="review-divider" />
                </div>
              );
            })}
        </div>
      )}

      {/* Show instructions only ONCE before test starts */}
      {step === 'results' && showInstructions === true && !showResultChart && (
        <div className="instructions-frame">
          <h2 className="heading">📝 Test Instructions</h2>
          <div className="instruction-section">
            <h3>📌 General Guidelines:</h3>
            <ul>
              <li>✅ Complete in one sitting. Timer won’t pause.</li>
              <li>⏱️ <strong>Time Limit:</strong> {selectedTest?.timing} mins</li>
              <li>🔐 Don’t refresh or close tab.</li>
              <li>📶 Stable internet is required.</li>
              <li>🧑‍💻 One attempt per student.</li>
              <li>⚠️ Avoid switching tabs or you’ll auto-submit.</li>
            </ul>
          </div>
          <div className="instruction-section">
            <h3>🧾 Before You Begin:</h3>
            <ul>
              <li>Keep your photo ID ready.</li>
              <li>Sit in a quiet place.</li>
            </ul>
          </div>
          <div className="final-note-checkbox">
            <input
              type="checkbox"
              id="agree"
              checked={selectedOption === 'agree'}
              onChange={(e) => setSelectedOption(e.target.checked ? 'agree' : '')}
            />
            <label htmlFor="agree" className="final-note">
              By starting, you agree to the instructions.
            </label>
          </div>
          <button
            className="start-test-btn"
            disabled={selectedOption !== 'agree'}
            onClick={() => {
              setStarted(true);
              setShowInstructions(false); // Hide instructions after starting
            }}
          >
            🟢 Start Test
          </button>
        </div>
      )}

      {/* Show test only after instructions are accepted */}
      {step === 'results' && started && !showInstructions && !showResultChart && questions.length > 0 && (
        <div className="test-frames-container">
          {/* TEST UI ONLY, NO INSTRUCTIONS HERE */}
          <div className="test-frame-1">
            <div className="timer-row">
              <div>
                <span className="timer-label">Time Left</span>
                <span className="timer-value">{formatTime(timeLeft)}</span>
                <div className="timer-progress">
                  <div
                    className="timer-bar"
                    style={{
                      width: selectedTest?.timing
                        ? `${(timeLeft / (parseInt(selectedTest.timing, 10) * 60)) * 100}%`
                        : '100%'
                    }}
                  />
                </div>
              </div>
              <div className="dropdown-select">
                <select
                  className="language-dropdown"
                  value={selectedTest?.language || ''}
                  disabled
                >
                  <option value={selectedTest?.language}>{selectedTest?.language}</option>
                </select>
              </div>
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
            </div>

            <div className="test-name-box">{selectedTest?.testName}</div>

            <div className="question-section">
              <div className="question-no">Question No. {questions[currentQIndex]?.questionNo}</div>
              <div className="question-text">{questions[currentQIndex]?.question}</div>
              <div className="options-list">
                <div className="answer-label">Answer :</div>
                <div className="answer-radio-row">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <label key={opt} className="option-radio">
                      <input
                        type="radio"
                        name="answer"
                        value={opt}
                        checked={selectedOption === opt}
                        disabled={questions[currentQIndex]?.savedCount >= 2}
                        onChange={() => setSelectedOption(opt)}
                      />
                      <span className="option-label">
                        {opt}: {questions[currentQIndex]?.[`option${opt}`]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="mark-btn" onClick={markQuestion}>Mark</button>
              <button className="prev-btn" onClick={prevQuestion} disabled={currentQIndex === 0}>Previous</button>
              <button className="skip-btn" onClick={() => {
                setQuestions(prev =>
                  prev.map((item, idx) =>
                    idx === currentQIndex ? { ...item, status: 'skipped' } : item
                  )
                );
                if (currentQIndex < questions.length - 1) {
                  setCurrentQIndex(currentQIndex + 1);
                  setSelectedOption('');
                  setQuestions(prev =>
                    prev.map((item, idx) =>
                      idx === currentQIndex + 1 && item.status === 'not-visited'
                        ? { ...item, status: 'not-answered' }
                        : item
                    )
                  );
                }
              }}>Skip</button>
              <button className="save-next-btn" onClick={saveAnswer} disabled={!selectedOption}>Save & Next</button>
            </div>
          </div>

          <div
            className={`test-frame-2 sidebar-panel ${sidebarOpen ? 'open' : ''}`}
          >
            <button
              className="sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
            <div className="sidebar-title">TNPSC PRACTICE TESTS</div>
            <div className="question-palette">
              {questions.map((q, i) => (
                <span
                  key={q.questionNo}
                  className={`palette-dot ${
                    q.status === 'answered'
                      ? 'answered'
                      : q.status === 'not-answered'
                      ? 'not-answered'
                      : q.status === 'marked'
                      ? 'marked'
                      : q.status === 'skipped'
                      ? 'skipped'
                      : 'not-visited'
                  } ${i === currentQIndex ? 'current' : ''}`}
                  onClick={() => goToQuestion(i)}
                  style={{ cursor: 'pointer' }}
                >
                  {q.questionNo}
                </span>
              ))}
            </div>
            <div className="palette-legend">
              <div><span className="dot answered" /> Answered</div>
              <div><span className="dot not-answered" /> Not Answered</div>
              <div><span className="dot marked" /> Marked</div>
              <div><span className="dot skipped" /> Skipped</div>
              <div><span className="dot not-visited" /> Not Visited</div>
            </div>
            <div className="sidebar-bottom-buttons">
              <button
                className="instructions-btn"
                onClick={() => setShowInstructions('sidebar')}
                disabled={showInstructions === true} // Disable if already shown once
              >
                Instructions
              </button>
              <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
            {/* Show instructions as a left-side panel when requested */}
            {showInstructions === 'sidebar' && (
              <div className="sidebar-instructions" style={{
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 18,
                marginTop: 18,
                marginBottom: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h2 className="heading">📝 Test Instructions</h2>
                <div className="instruction-section">
                  <h3>📌 General Guidelines:</h3>
                  <ul>
                    <li>✅ Complete in one sitting. Timer won’t pause.</li>
                    <li>⏱️ <strong>Time Limit:</strong> {selectedTest?.timing} mins</li>
                    <li>🔐 Don’t refresh or close tab.</li>
                    <li>📶 Stable internet is required.</li>
                    <li>🧑‍💻 One attempt per student.</li>
                    <li>⚠️ Avoid switching tabs or you’ll auto-submit.</li>
                  </ul>
                </div>
                <div className="instruction-section">
                  <h3>🧾 Before You Begin:</h3>
                  <ul>
                    <li>Keep your photo ID ready.</li>
                    <li>Sit in a quiet place.</li>
                  </ul>
                </div>
                <button
                  className="close-instructions-btn"
                  style={{
                    marginTop: 10,
                    padding: '6px 18px',
                    borderRadius: 6,
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    fontSize: 16
                  }}
                  onClick={() => setShowInstructions(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      )}

      {/* Result Pie Chart Popup */}
      {showResultChart && (
        <div className="result-popup">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Donut PieChart with score in center */}
            <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 20 }}>
              <PieChart width={240} height={240}>
                <Pie
                  data={[
                    { name: 'Correct', value: resultData.correct },
                    { name: 'Wrong', value: resultData.wrong },
                    { name: 'Skipped', value: resultData.skipped }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#00FF00" />
                  <Cell fill="#FF0000" />
                  <Cell fill="#800080" />
                </Pie>
              </PieChart>
              {/* Score in center */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Scores</div>
                <div style={{ fontSize: 48, fontWeight: 700 }}>{resultData.totalScore}</div>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#00FF00', display: 'inline-block', marginRight: 10 }}></span>
                <span style={{ fontSize: 16 }}>Correct Answer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF0000', display: 'inline-block', marginRight: 10 }}></span>
                <span style={{ fontSize: 16 }}>Wrong Answer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#800080', display: 'inline-block', marginRight: 10 }}></span>
                <span style={{ fontSize: 16 }}>Skipped</span>
              </div>
            </div>

            {/* Counts Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #222', padding: 8 }}>Correct</th>
                  <th style={{ border: '1px solid #222', padding: 8 }}>Wrong</th>
                  <th style={{ border: '1px solid #222', padding: 8 }}>Skipped</th>
                  <th style={{ border: '1px solid #222', padding: 8 }}>Total Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #222', padding: 8 }}>{resultData.correct}</td>
                  <td style={{ border: '1px solid #222', padding: 8 }}>{resultData.wrong}</td>
                  <td style={{ border: '1px solid #222', padding: 8 }}>{resultData.skipped}</td>
                  <td style={{ border: '1px solid #222', padding: 8 }}>{resultData.totalScore}</td>
                </tr>
              </tbody>
            </table>
            <button
              className="close-result-btn"
              onClick={() => {
                setShowResultChart(false);
                setStep('testname');
                setSelectedTest(null);
                setQuestions([]);
                setCurrentQIndex(0);
                setSelectedOption('');
                setShowInstructions(true);
                setOkDisabled(false);
              }}
              style={{
                marginTop: 10,
                padding: '8px 24px',
                borderRadius: 6,
                background: '#222',
                color: '#fff',
                border: 'none',
                fontSize: 18
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {step === 'review' && reviewData.length > 0 && (
        <div className="review-container">
          {reviewData.map((q) => (
            <div key={q.questionNo} className="review-question">
              <h3>Q{q.questionNo}. {q.question}</h3>
              {['A', 'B', 'C', 'D'].map(letter => {
                const optionText = q[`option${letter}`];
                const isCorrect = letter === q.correctAnswer;
                const isSelected = letter === q.givenAnswer;
                const isWrong = isSelected && !isCorrect;

                return (
                  <div
                    key={letter}
                    className={
                      'review-option' +
                      (isCorrect ? ' correct' : '') +
                      (isSelected ? ' selected' : '') +
                      (isWrong ? ' wrong' : '')
                    }
                  >
                    <strong>{letter}:</strong>&nbsp;{optionText}
                    {isCorrect && <span className="icon">✅</span>}
                    {isWrong && <span className="icon">❌</span>}
                    {isSelected && <span className="your-answer">(Your Answer)</span>}
                  </div>
                );
              })}
              {!['A','B','C','D'].includes(q.givenAnswer) && (
                <div className="not-answered">Not Answered</div>
              )}
            </div>
          ))}
          <button onClick={() => setStep('testname')}>⬅ Back</button>
        </div>
      )}

      {/* Video Preview Modal */}
      {showVideoPreview && (
        <div className="video-preview-overlay">
          <div className="video-preview-modal">
            <div className="video-preview-header">
              <h3>📹 Video Preview</h3>
              <button 
                className="video-close-btn"
                onClick={() => {
                  setShowVideoPreview(false);
                  setVideoUrl('');
                }}
              >
                ✖
              </button>
            </div>
            <div className="video-preview-content">
              <video 
                controls 
                width="100%" 
                height="400"
                src={videoUrl}
                style={{ borderRadius: '8px' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-preview-footer">
              <button 
                className="video-fullscreen-btn"
                onClick={() => window.open(videoUrl, '_blank')}
              >
                🔗 Open in New Tab
              </button>
              <button 
                className="video-close-footer-btn"
                onClick={() => {
                  setShowVideoPreview(false);
                  setVideoUrl('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
