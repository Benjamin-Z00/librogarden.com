import { useState, useEffect } from 'react'
import { Layout, Typography, message, Select, Button } from 'antd'
import { TrophyOutlined, FieldTimeOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { poems } from './data/poems'
import './App.css'

const { Header, Content } = Layout
const { Title } = Typography

// 计算基础分数（考虑诗词长度）
const calculateBaseScore = (poemLength) => {
  return Math.floor(1000 * (1 + poemLength / 20))
}

// 计算时间扣分
const calculateTimeDeduction = (seconds) => {
  return Math.floor(seconds * 2)
}

// 计算错误扣分
const calculateErrorDeduction = (errors) => {
  return Math.floor(errors * 50)
}

function App() {
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0)
  const [scrambledChars, setScrambledChars] = useState(() => {
    return poems[0].content.split('').sort(() => Math.random() - 0.5)
  })
  const [selectedChars, setSelectedChars] = useState([])
  const [messageApi, contextHolder] = message.useMessage()
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('poemHighScores')
    return saved ? JSON.parse(saved) : {}
  })

  const currentPoem = poems[currentPoemIndex]
  const currentHighScore = highScores[currentPoem.id] || 0

  // 计时器
  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // 切换诗词
  const handlePoemChange = (value) => {
    setCurrentPoemIndex(value)
    resetGame()
  }

  // 重置游戏状态
  const resetGame = () => {
    setSelectedChars([])
    setScrambledChars(poems[currentPoemIndex].content.split('').sort(() => Math.random() - 0.5))
    setTimer(0)
    setIsTimerRunning(false)
    setErrorCount(0)
    setIsComplete(false)
  }

  // 检查当前选择的字符是否正确
  const checkCurrentProgress = () => {
    const correctChars = currentPoem.content.split('')
    for (let i = 0; i < selectedChars.length; i++) {
      if (selectedChars[i] !== correctChars[i]) {
        return false
      }
    }
    return true
  }

  // 检查是否完成整首诗
  const checkCompletion = () => {
    return selectedChars.join('') === currentPoem.content
  }

  // 计算最终得分
  const calculateFinalScore = () => {
    const baseScore = calculateBaseScore(currentPoem.content.length)
    const timeDeduction = calculateTimeDeduction(timer)
    const errorDeduction = calculateErrorDeduction(errorCount)
    return Math.max(0, baseScore - timeDeduction - errorDeduction)
  }

  // 更新最高分
  const updateHighScore = (newScore) => {
    if (newScore > currentHighScore) {
      const newHighScores = { ...highScores, [currentPoem.id]: newScore }
      setHighScores(newHighScores)
      localStorage.setItem('poemHighScores', JSON.stringify(newHighScores))
      return true
    }
    return false
  }

  // 提交答案
  const handleSubmit = () => {
    if (!checkCompletion()) {
      messageApi.error('诗句还未完成或顺序不对，请检查！')
      return
    }
    
    setIsTimerRunning(false)
    const finalScore = calculateFinalScore()
    const isNewHighScore = updateHighScore(finalScore)
    
    messageApi.success(
      <div>
        <p>恭喜你完成了！</p>
        <p>用时：{timer}秒</p>
        <p>错误：{errorCount}次</p>
        <p>得分：{finalScore}</p>
        {isNewHighScore && <p>新纪录！</p>}
      </div>
    )
  }

  // 当选择字符时的处理
  const handleCharClick = (char, index) => {
    if (!isTimerRunning && !isComplete) {
      setIsTimerRunning(true)
    }

    const newSelectedChars = [...selectedChars, char]
    setScrambledChars(prev => prev.filter((_, i) => i !== index))
    setSelectedChars(newSelectedChars)

    // 检查新选择的字符是否正确
    const isCurrentCorrect = checkCurrentProgress()
    if (!isCurrentCorrect) {
      setErrorCount(prev => prev + 1)
      messageApi.error('顺序不对，请重试！')
      setTimeout(() => {
        setScrambledChars(currentPoem.content.split('').sort(() => Math.random() - 0.5))
        setSelectedChars([])
      }, 1000)
      return
    }

    // 检查是否完成
    if (newSelectedChars.length === currentPoem.content.length) {
      setIsComplete(true)
    }
  }

  // 撤销最后一个选择
  const handleUndo = () => {
    if (selectedChars.length > 0) {
      const lastChar = selectedChars[selectedChars.length - 1]
      setSelectedChars(prev => prev.slice(0, -1))
      setScrambledChars(prev => [...prev, lastChar].sort(() => Math.random() - 0.5))
      setIsComplete(false)
    }
  }

  return (
    <Layout className="layout">
      {contextHolder}
      <Header className="header">
        <Title level={2} style={{ color: 'white', margin: '10px 0' }}>
          古诗划字连词
        </Title>
      </Header>
      <Content className="content">
        <div className="game-container">
          <div className="poem-selector">
            <Select
              value={currentPoemIndex}
              onChange={handlePoemChange}
              style={{ width: 200 }}
              options={poems.map((poem, index) => ({
                value: index,
                label: `${poem.title} - ${poem.author}`
              }))}
            />
          </div>

          <div className="poem-info">
            <Title level={3}>{currentPoem.title}</Title>
            <p className="author">
              {currentPoem.dynasty}·{currentPoem.author}
            </p>
          </div>

          <div className="game-stats">
            <div className="stat-item">
              <FieldTimeOutlined /> 用时：{timer}秒
            </div>
            <div className="stat-item">
              <CloseCircleOutlined /> 错误：{errorCount}次
            </div>
            <div className="stat-item">
              <TrophyOutlined /> 最高分：{currentHighScore}
            </div>
          </div>
          
          <div className="selected-chars">
            {selectedChars.map((char, index) => (
              <span 
                key={index} 
                className={`char ${checkCurrentProgress() ? 'correct' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="button-group">
            <button 
              className="action-button undo-button" 
              onClick={handleUndo}
              disabled={selectedChars.length === 0}
            >
              撤销
            </button>
            <button className="action-button reset-button" onClick={resetGame}>
              重新开始
            </button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              disabled={!isComplete}
              className="submit-button"
            >
              提交答案
            </Button>
          </div>

          <div className="char-pool">
            {scrambledChars.map((char, index) => (
              <span
                key={index}
                className="char"
                onClick={() => handleCharClick(char, index)}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="score-info">
            <p>计分规则：</p>
            <ul>
              <li>基础分：1000-{calculateBaseScore(currentPoem.content.length)}分（根据诗词长度）</li>
              <li>时间扣分：每秒 -2分</li>
              <li>错误扣分：每次 -50分</li>
            </ul>
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default App
