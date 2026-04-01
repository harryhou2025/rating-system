export interface ScoringResult {
  totalScore: number;
  severity?: string;
  riskLevel?: string;
  recommendation: string;
  details?: Record<string, any>;
}

export function calculateGAD7(answers: Record<string, number>): ScoringResult {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  let severity: string;
  let recommendation: string;
  
  if (totalScore < 5) {
    severity = '无焦虑';
    recommendation = '无需处理，定期观察';
  } else if (totalScore < 10) {
    severity = '轻度焦虑';
    recommendation = '建议观察随访';
  } else if (totalScore < 15) {
    severity = '中度焦虑';
    recommendation = '建议进一步评估';
  } else {
    severity = '重度焦虑';
    recommendation = '建议转介精神专科';
  }
  
  const symptomCount = values.filter(val => val >= 1).length;
  const probableGAD = symptomCount >= 3 && totalScore >= 10;
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      range: '0-21',
      cutoff: 10,
      symptomCount,
      probableGAD,
    },
  };
}

export function calculatePHQ9(answers: Record<string, number>): ScoringResult {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  let severity: string;
  let recommendation: string;
  
  if (totalScore < 5) {
    severity = '无抑郁';
    recommendation = '无需处理，定期观察';
  } else if (totalScore < 10) {
    severity = '轻度抑郁';
    recommendation = '支持观察，随访';
  } else if (totalScore < 15) {
    severity = '中度抑郁';
    recommendation = '建议进一步评估/治疗';
  } else if (totalScore < 20) {
    severity = '中重度抑郁';
    recommendation = '需要积极治疗干预';
  } else {
    severity = '重度抑郁';
    recommendation = '立即转介精神专科治疗';
  }
  
  const symptomCount = values.filter(val => val >= 1).length;
  const anhedoniaDepressed = (values[0] >= 1 || values[1] >= 1);
  const probableMDD = symptomCount >= 5 && anhedoniaDepressed;
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      range: '0-27',
      cutoff: 10,
      symptomCount,
      probableMDD,
    },
  };
}

export function calculateSAS(answers: Record<string, number>): ScoringResult {
  const reverseItems = [5, 9, 13, 17, 19];
  
  let rawScore = 0;
  Object.entries(answers).forEach(([key, value]) => {
    const questionNum = parseInt(key.replace('q', ''));
    if (reverseItems.includes(questionNum)) {
      rawScore += 5 - value;
    } else {
      rawScore += value;
    }
  });
  
  const standardScore = Math.round(rawScore * 1.25 * 10) / 10;
  
  let severity: string;
  let recommendation: string;
  
  if (standardScore < 50) {
    severity = '无焦虑';
    recommendation = '无明显焦虑症状';
  } else if (standardScore < 59) {
    severity = '轻度焦虑';
    recommendation = '可能存在轻度焦虑，建议观察';
  } else if (standardScore < 69) {
    severity = '中度焦虑';
    recommendation = '提示中度焦虑，建议评估干预';
  } else {
    severity = '重度焦虑';
    recommendation = '提示重度焦虑，建议转介专科治疗';
  }
  
  return {
    totalScore: standardScore,
    severity,
    recommendation,
    details: {
      rawScore,
      standardScore,
      range: '25-100',
    },
  };
}

export function calculateSDS(answers: Record<string, number>): ScoringResult {
  const reverseItems = [2, 5, 6, 11, 12, 14, 16, 17, 18, 20];
  
  let rawScore = 0;
  Object.entries(answers).forEach(([key, value]) => {
    const questionNum = parseInt(key.replace('q', ''));
    if (reverseItems.includes(questionNum)) {
      rawScore += 5 - value;
    } else {
      rawScore += value;
    }
  });
  
  const standardScore = Math.round(rawScore * 1.25 * 10) / 10;
  
  let severity: string;
  let recommendation: string;
  
  if (standardScore < 53) {
    severity = '无抑郁';
    recommendation = '无抑郁或极轻微';
  } else if (standardScore < 63) {
    severity = '轻度抑郁';
    recommendation = '可能存在轻度抑郁，建议进一步评估';
  } else if (standardScore < 73) {
    severity = '中度抑郁';
    recommendation = '提示中度抑郁，建议心理咨询/治疗';
  } else {
    severity = '重度抑郁';
    recommendation = '提示严重抑郁，建议转介专科治疗';
  }
  
  return {
    totalScore: standardScore,
    severity,
    recommendation,
    details: {
      rawScore,
      standardScore,
      range: '25-100',
    },
  };
}

export function calculateSCL90(answers: Record<string, number>): ScoringResult {
  const factors = {
    somatization: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    obsessive: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    interpersonal: [24, 25, 26, 27, 28, 29, 30, 31, 32],
    depression: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    anxiety: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
    hostility: [53, 54, 55, 56, 57, 58],
    phobic: [59, 60, 61, 62, 63, 64, 65],
    paranoid: [66, 67, 68, 69, 70],
    psychotic: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
  };
  
  const factorScores: Record<string, number> = {};
  
  for (const [name, items] of Object.entries(factors)) {
    const total = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
    factorScores[name] = Math.round((total / items.length) * 100) / 100;
  }
  
  let totalScore = 0;
  let positiveCount = 0;
  
  for (let i = 1; i <= 90; i++) {
    const score = answers[`q${i}`] || 0;
    totalScore += score;
    if (score >= 1) positiveCount++;
  }
  
  const gtScore = Math.round((totalScore / 90) * 100) / 100;
  const positiveMean = positiveCount > 0 ? Math.round((totalScore / positiveCount) * 100) / 100 : 0;
  
  let severity: string;
  let recommendation: string;
  
  if (gtScore >= 1.6 || totalScore >= 160) {
    severity = '阳性';
    recommendation = '提示可能有心理问题，建议进一步评估';
  } else {
    severity = '阴性';
    recommendation = '无明显症状，建议常规观察';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      factorScores,
      gtScore,
      positiveCount,
      positiveMean,
      factorInterpretation: Object.entries(factorScores).map(([name, score]) => ({
        name: getFactorName(name),
        score,
        abnormal: score >= 2
      }))
    },
  };
}

function getFactorName(factorName: string): string {
  const names: Record<string, string> = {
    somatization: '躯体化',
    obsessive: '强迫症状',
    interpersonal: '人际关系敏感',
    depression: '抑郁',
    anxiety: '焦虑',
    hostility: '敌对',
    phobic: '恐怖',
    paranoid: '偏执',
    psychotic: '精神病性',
  };
  return names[factorName] || factorName;
}

export function calculateMCHAT(answers: Record<string, number>): ScoringResult {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  let riskLevel: string;
  let recommendation: string;
  
  if (totalScore >= 7) {
    riskLevel = '高风险';
    recommendation = '立即转介专业ASD诊断评估';
  } else if (totalScore >= 3) {
    riskLevel = '中风险';
    recommendation = '建议进一步发育筛查';
  } else {
    riskLevel = '低风险';
    recommendation = '通过初筛，维持常规发育监测';
  }
  
  return {
    totalScore,
    riskLevel,
    recommendation,
    details: {
      range: '0-20',
      mediumThreshold: 3,
      highThreshold: 7,
    },
  };
}

export function calculateCARS(answers: Record<string, number>): ScoringResult {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  let severity: string;
  let recommendation: string;
  
  if (totalScore < 30) {
    severity = '非自闭症';
    recommendation = '常规发育监测';
  } else if (totalScore < 36) {
    severity = '轻度';
    recommendation = '建议进一步全面ASD诊断评估';
  } else if (totalScore < 45) {
    severity = '中度';
    recommendation = '建议专业ASD诊断并制定干预方案';
  } else {
    severity = '重度';
    recommendation = '建议综合诊断并制定强化干预方案';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      range: '15-60',
      averageScore: Math.round((totalScore / 15) * 100) / 100,
      dimensions: 15,
      maxScore: 60,
    },
  };
}

export function calculateAQ(answers: Record<string, number>): ScoringResult {
  const forwardItems = new Set([
    1, 2, 4, 7, 9, 13, 14, 16, 19, 3, 5, 10, 11, 12, 20, 33,
    6, 15, 17, 21, 23, 26, 32, 36, 37, 30, 31, 38, 40, 44,
    35, 39, 41, 42, 43, 45, 46, 48, 49, 50
  ]);
  
  const reverseItems = new Set([25, 22, 27, 29, 28, 8, 18, 24, 34, 47]);
  
  let totalScore = 0;
  
  Object.entries(answers).forEach(([key, value]) => {
    const questionNum = parseInt(key.replace('q', ''));
    
    if (forwardItems.has(questionNum)) {
      if (value <= 2) totalScore += 1;
    } else if (reverseItems.has(questionNum)) {
      if (value >= 3) totalScore += 1;
    }
  });
  
  let riskLevel: string;
  let recommendation: string;
  
  if (totalScore >= 32) {
    riskLevel = '高风险';
    recommendation = '建议转介专业ASD诊断评估';
  } else if (totalScore >= 26) {
    riskLevel = '中风险';
    recommendation = '建议进一步筛查或转介专业评估';
  } else {
    riskLevel = '低风险';
    recommendation = '常规关注';
  }
  
  return {
    totalScore,
    riskLevel,
    recommendation,
    details: {
      range: '0-50',
      mediumThreshold: 26,
      highThreshold: 32,
      forwardItemsCount: forwardItems.size,
      reverseItemsCount: reverseItems.size,
    },
  };
}

export function calculateDCDQ(answers: Record<string, number>): ScoringResult {
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  const factors = {
    fineMotor: [1, 2, 3, 4, 5],
    grossMotor: [6, 7, 8, 9, 10],
    control: [11, 12, 13, 14],
    general: [15, 16, 17],
  };
  
  const factorScores: Record<string, number> = {};
  for (const [name, items] of Object.entries(factors)) {
    factorScores[name] = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  }
  
  let riskLevel: string;
  let recommendation: string;
  let severity: string;
  
  const cutoff = 52;
  const mediumCutoff = cutoff + 8;
  
  if (totalScore <= cutoff) {
    severity = '高风险（疑似DCD）';
    riskLevel = '高风险';
    recommendation = '建议专业运动评估';
  } else if (totalScore <= mediumCutoff) {
    severity = '中等风险';
    riskLevel = '中风险';
    recommendation = '建议运动训练观察';
  } else {
    severity = '低风险';
    riskLevel = '低风险';
    recommendation = '正常运动发育';
  }
  
  return {
    totalScore,
    severity,
    riskLevel,
    recommendation,
    details: {
      range: '17-85',
      cutoff: 52,
      mediumCutoff: 60,
      factorScores: {
        '精细运动与书写': factorScores.fineMotor,
        '粗大运动': factorScores.grossMotor,
        '运动控制': factorScores.control,
        '总体协调': factorScores.general,
      },
      note: '得分越低，表示运动协调困难越明显，DCD风险越高',
    },
  };
}

export function calculateRCADS(answers: Record<string, number>): ScoringResult {
  const reverseItems = [2]; // 第2题是反向计分
  
  // 计算各因子得分
  const factors = {
    separationAnxiety: [6, 9, 14, 17, 24, 28, 32],
    generalizedAnxiety: [1, 7, 10, 12, 25, 35, 39, 47],
    socialAnxiety: [3, 11, 16, 22, 23, 31, 36, 40, 44, 46],
    ocd: [8, 13, 15, 21, 27, 43, 45],
    panic: [4, 19, 26, 33, 37, 38, 41, 42],
    depression: [2, 5, 18, 29, 30, 34, 48],
  };
  
  const factorScores: Record<string, number> = {};
  let totalAnxietyScore = 0;
  let depressionScore = 0;
  
  // 计算各因子得分
  for (const [name, items] of Object.entries(factors)) {
    let factorScore = 0;
    for (const num of items) {
      let score = answers[`q${num}`] || 0;
      // 处理反向计分
      if (reverseItems.includes(num)) {
        score = 3 - score;
      }
      factorScore += score;
    }
    factorScores[name] = factorScore;
    
    // 计算焦虑总分（除抑郁外的所有因子）
    if (name !== 'depression') {
      totalAnxietyScore += factorScore;
    } else {
      depressionScore = factorScore;
    }
  }
  
  // 计算总得分（焦虑总分 + 抑郁得分）
  const totalScore = totalAnxietyScore + depressionScore;
  
  // 评估焦虑严重程度
  let anxietySeverity: string;
  let depressionSeverity: string;
  let overallSeverity: string;
  let recommendation: string;
  
  // 焦虑严重程度评估
  if (totalAnxietyScore < 25) {
    anxietySeverity = '无焦虑';
  } else if (totalAnxietyScore < 40) {
    anxietySeverity = '轻度焦虑';
  } else if (totalAnxietyScore < 60) {
    anxietySeverity = '中度焦虑';
  } else {
    anxietySeverity = '重度焦虑';
  }
  
  // 抑郁严重程度评估
  if (depressionScore < 10) {
    depressionSeverity = '无抑郁';
  } else if (depressionScore < 15) {
    depressionSeverity = '轻度抑郁';
  } else if (depressionScore < 20) {
    depressionSeverity = '中度抑郁';
  } else {
    depressionSeverity = '重度抑郁';
  }
  
  // 总体严重程度评估
  if (totalAnxietyScore < 25 && depressionScore < 10) {
    overallSeverity = '无明显症状';
    recommendation = '无需处理，定期观察';
  } else if (totalAnxietyScore < 40 && depressionScore < 15) {
    overallSeverity = '轻度症状';
    recommendation = '建议观察随访';
  } else if (totalAnxietyScore < 60 && depressionScore < 20) {
    overallSeverity = '中度症状';
    recommendation = '建议进一步评估';
  } else {
    overallSeverity = '重度症状';
    recommendation = '建议转介精神专科';
  }
  
  return {
    totalScore,
    severity: overallSeverity,
    recommendation,
    details: {
      anxietyScore: totalAnxietyScore,
      depressionScore,
      anxietySeverity,
      depressionSeverity,
      factorScores: {
        '分离焦虑': factorScores.separationAnxiety,
        '广泛性焦虑': factorScores.generalizedAnxiety,
        '社交焦虑': factorScores.socialAnxiety,
        '强迫症': factorScores.ocd,
        '恐慌症': factorScores.panic,
        '重性抑郁': factorScores.depression,
      },
      ranges: {
        anxiety: '0-105',
        depression: '0-24',
        total: '0-129',
      },
      cutoffs: {
        anxiety: 25,
        depression: 10,
      },
    },
  };
}

export function calculateSCARED(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目
  const factors = {
    panic: [1, 2, 3, 4, 5, 6, 7, 8],
    generalized: [9, 10, 11, 12, 13, 14, 15, 16, 17, 36, 37, 38, 39, 40, 41],
    separation: [18, 19, 20, 21, 22],
    social: [23, 24, 25, 26, 27, 28, 34, 35],
    school: [29, 30, 31, 32, 33],
  };
  
  const factorScores: Record<string, number> = {};
  let totalScore = 0;
  
  // 计算各因子得分
  for (const [name, items] of Object.entries(factors)) {
    const factorScore = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
    factorScores[name] = factorScore;
    totalScore += factorScore;
  }
  
  // 评估焦虑严重程度
  let severity: string;
  let recommendation: string;
  
  if (totalScore < 25) {
    severity = '无焦虑';
    recommendation = '无需处理';
  } else if (totalScore < 35) {
    severity = '轻度焦虑';
    recommendation = '建议观察';
  } else if (totalScore < 50) {
    severity = '中度焦虑';
    recommendation = '建议专业评估';
  } else {
    severity = '重度焦虑';
    recommendation = '建议转介治疗';
  }
  
  // 识别可能的障碍类型
  const possibleDisorders: string[] = [];
  if (factorScores.panic >= 7) possibleDisorders.push('恐慌障碍/广场恐惧');
  if (factorScores.generalized >= 9) possibleDisorders.push('广泛性焦虑障碍');
  if (factorScores.separation >= 5) possibleDisorders.push('分离焦虑障碍');
  if (factorScores.social >= 8) possibleDisorders.push('社交焦虑障碍');
  if (factorScores.school >= 3) possibleDisorders.push('学校焦虑');
  
  const possibleDisorder = possibleDisorders.length > 0 ? possibleDisorders.join('、') : '无特定障碍';
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      factorScores: {
        '恐慌/广场恐惧': factorScores.panic,
        '广泛性焦虑': factorScores.generalized,
        '分离焦虑': factorScores.separation,
        '社交焦虑': factorScores.social,
        '学校焦虑': factorScores.school,
      },
      possibleDisorder,
      ranges: {
        total: '0-82',
        panic: '0-16',
        generalized: '0-30',
        separation: '0-10',
        social: '0-18',
        school: '0-10',
      },
      cutoffs: {
        anxiety: 25,
        highProbability: 31,
      },
    },
  };
}

export function calculateSNAPIV(answers: Record<string, number>): ScoringResult {
  // 定义各维度对应的题目
  const inattentionItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const hyperactivityItems = [10, 11, 12, 13, 14, 15, 16, 17, 18];
  const oddItems = [19, 20, 21, 22, 23, 24, 25, 26];
  
  // 计算各维度得分
  const inattentionScore = inattentionItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const hyperactivityScore = hyperactivityItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const oddScore = oddItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  
  // 计算均分
  const inattentionAvg = inattentionScore / inattentionItems.length;
  const hyperactivityAvg = hyperactivityScore / hyperactivityItems.length;
  
  // 计算症状数（得分≥2的题目数）
  const inattentionSymptomCount = inattentionItems.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  const hyperactivitySymptomCount = hyperactivityItems.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  
  // 判断ADHD亚型
  let adhdType: string;
  if (inattentionSymptomCount >= 6 && hyperactivitySymptomCount >= 6) {
    adhdType = '混合型ADHD';
  } else if (inattentionSymptomCount >= 6) {
    adhdType = '注意缺陷型ADHD';
  } else if (hyperactivitySymptomCount >= 6) {
    adhdType = '多动-冲动型ADHD';
  } else {
    adhdType = '不确定或无ADHD';
  }
  
  // 评估严重程度
  const maxAvg = Math.max(inattentionAvg, hyperactivityAvg);
  let severity: string;
  let recommendation: string;
  
  if (maxAvg < 1.0) {
    severity = '正常范围';
    recommendation = '无需处理，定期观察';
  } else if (maxAvg < 1.5) {
    severity = '轻度可疑';
    recommendation = '建议观察随访';
  } else if (maxAvg < 2.0) {
    severity = '中度可疑';
    recommendation = '建议进一步评估';
  } else {
    severity = '高度可疑';
    recommendation = '高度怀疑ADHD，建议诊断评估';
  }
  
  return {
    totalScore: inattentionScore + hyperactivityScore + oddScore,
    severity,
    recommendation,
    details: {
      inattentionScore,
      hyperactivityScore,
      oddScore,
      inattentionAvg: parseFloat(inattentionAvg.toFixed(2)),
      hyperactivityAvg: parseFloat(hyperactivityAvg.toFixed(2)),
      inattentionSymptomCount,
      hyperactivitySymptomCount,
      adhdType,
      ranges: {
        inattention: '0-27',
        hyperactivity: '0-27',
        odd: '0-24',
        total: '0-78',
      },
      cutoffs: {
        parent: {
          inattention: 1.78,
          hyperactivity: 1.44,
        },
        teacher: {
          inattention: 1.33,
          hyperactivity: 1.22,
        },
      },
    },
  };
}

export function calculateVANDERBILT(answers: Record<string, number>): ScoringResult {
  // 定义各维度对应的题目（共57题）
  const inattentionItems = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9题 - 注意缺陷（IN）
  const hyperactivityItems = [10, 11, 12, 13, 14, 15, 16, 17, 18]; // 9题 - 多动-冲动（HI）
  const oddItems = [19, 20, 21, 22, 23, 24, 25, 26]; // 8题 - 对立违抗障碍（ODD）
  const conductItems = [27, 28, 29, 30, 31]; // 5题 - 品行障碍（CD）
  const anxietyItems = [32, 33, 34, 35, 36]; // 5题 - 焦虑（ANX）
  const depressionItems = [37, 38, 39, 40, 41]; // 5题 - 抑郁（DEP）
  const learningItems = [42, 43, 44, 45]; // 4题 - 学习问题（LEARN）
  const impairmentItems = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // 12题 - 功能损害（IMPAIR/IMP）
  
  // 计算各维度得分
  const inattentionScore = inattentionItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const hyperactivityScore = hyperactivityItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const oddScore = oddItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const conductScore = conductItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const anxietyScore = anxietyItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const depressionScore = depressionItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const learningScore = learningItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const impairmentScore = impairmentItems.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  
  // 计算均分
  const inattentionAvg = inattentionScore / inattentionItems.length;
  const hyperactivityAvg = hyperactivityScore / hyperactivityItems.length;
  
  // 计算症状数（得分≥2的题目数）
  const inattentionSymptomCount = inattentionItems.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  const hyperactivitySymptomCount = hyperactivityItems.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  
  // 判断ADHD亚型
  let adhdType: string;
  if (inattentionSymptomCount >= 6 && hyperactivitySymptomCount >= 6) {
    adhdType = '混合型ADHD';
  } else if (inattentionSymptomCount >= 6) {
    adhdType = '注意缺陷型ADHD';
  } else if (hyperactivitySymptomCount >= 6) {
    adhdType = '多动-冲动型ADHD';
  } else {
    adhdType = '不确定或无ADHD';
  }
  
  // 评估严重程度
  const maxAvg = Math.max(inattentionAvg, hyperactivityAvg);
  let severity: string;
  let recommendation: string;
  
  if (maxAvg < 1.0) {
    severity = '正常范围';
    recommendation = '无需处理，定期观察';
  } else if (maxAvg < 1.5) {
    severity = '轻度可疑';
    recommendation = '建议观察随访';
  } else if (maxAvg < 2.0) {
    severity = '中度可疑';
    recommendation = '建议进一步评估';
  } else {
    severity = '高度可疑';
    recommendation = '高度怀疑ADHD，建议诊断评估';
  }
  
  return {
    totalScore: inattentionScore + hyperactivityScore + oddScore + conductScore + anxietyScore + depressionScore + learningScore + impairmentScore,
    severity,
    recommendation,
    details: {
      inattentionScore,
      hyperactivityScore,
      oddScore,
      conductScore,
      anxietyScore,
      depressionScore,
      learningScore,
      impairmentScore,
      inattentionAvg: parseFloat(inattentionAvg.toFixed(2)),
      hyperactivityAvg: parseFloat(hyperactivityAvg.toFixed(2)),
      inattentionSymptomCount,
      hyperactivitySymptomCount,
      adhdType,
      ranges: {
        inattention: '0-27',
        hyperactivity: '0-27',
        odd: '0-24',
        conduct: '0-15',
        anxiety: '0-15',
        depression: '0-15',
        learning: '0-12',
        impairment: '0-36',
        total: '0-162',
      },
    },
  };
}

export function calculateCONNERS3PARENT(answers: Record<string, number>): ScoringResult {
  // 定义各维度对应的题目（110题）
  const factors = {
    inattention: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    hyperactivity: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
    learningProblems: [44, 45, 46, 47, 48, 49, 50, 51],
    aggression: [52, 53, 54, 55, 56, 57, 58, 59, 60],
    oppositional: [61, 62, 63, 64, 65, 66, 67],
    conductDisorder: [68, 69, 70, 71],
    perfectionism: [72, 73, 74, 75],
    peerRelations: [76, 77, 78, 79, 80],
    workingMemory: [81, 82, 83, 84, 85, 86],
    executiveFunction: [87, 88, 89, 90, 91],
    organization: [92, 93, 94, 95, 96, 97, 98],
    emotionalDysregulation: [99, 100, 101, 102, 103, 104, 105],
    anxiety: [106, 107, 108, 109, 110],
  };
  
  // 计算各维度得分
  const factorScores: Record<string, number> = {};
  let totalScore = 0;
  
  for (const [name, items] of Object.entries(factors)) {
    const score = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
    factorScores[name] = score;
    totalScore += score;
  }
  
  // 计算ADHD总分
  const adhdTotal = factorScores.inattention + factorScores.hyperactivity;
  
  // 计算注意力不集中和多动-冲动的均分
  const inattentionAvg = factorScores.inattention / factors.inattention.length;
  const hyperactivityAvg = factorScores.hyperactivity / factors.hyperactivity.length;
  
  // 计算症状数（得分≥2的题目数）
  const inattentionSymptomCount = factors.inattention.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  const hyperactivitySymptomCount = factors.hyperactivity.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  
  // 判断ADHD亚型
  let adhdType: string;
  if (inattentionSymptomCount >= 6 && hyperactivitySymptomCount >= 6) {
    adhdType = '混合型ADHD';
  } else if (inattentionSymptomCount >= 6) {
    adhdType = '注意缺陷型ADHD';
  } else if (hyperactivitySymptomCount >= 6) {
    adhdType = '多动-冲动型ADHD';
  } else {
    adhdType = '不确定或无ADHD';
  }
  
  // 评估严重程度
  const maxAvg = Math.max(inattentionAvg, hyperactivityAvg);
  let severity: string;
  let recommendation: string;
  
  if (maxAvg < 1.0) {
    severity = '正常范围';
    recommendation = '无需处理，定期观察';
  } else if (maxAvg < 1.5) {
    severity = '轻度可疑';
    recommendation = '建议观察随访';
  } else if (maxAvg < 2.0) {
    severity = '中度可疑';
    recommendation = '建议进一步评估';
  } else {
    severity = '高度可疑';
    recommendation = '高度怀疑ADHD，建议诊断评估';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      inattentionScore: factorScores.inattention,
      hyperactivityScore: factorScores.hyperactivity,
      learningProblemsScore: factorScores.learningProblems,
      aggressionScore: factorScores.aggression,
      oppositionalScore: factorScores.oppositional,
      conductDisorderScore: factorScores.conductDisorder,
      perfectionismScore: factorScores.perfectionism,
      peerRelationsScore: factorScores.peerRelations,
      workingMemoryScore: factorScores.workingMemory,
      executiveFunctionScore: factorScores.executiveFunction,
      organizationScore: factorScores.organization,
      emotionalDysregulationScore: factorScores.emotionalDysregulation,
      anxietyScore: factorScores.anxiety,
      adhdTotal,
      inattentionAvg: parseFloat(inattentionAvg.toFixed(2)),
      hyperactivityAvg: parseFloat(hyperactivityAvg.toFixed(2)),
      inattentionSymptomCount,
      hyperactivitySymptomCount,
      adhdType,
      ranges: {
        inattention: '0-81',
        hyperactivity: '0-48',
        learningProblems: '0-24',
        aggression: '0-27',
        oppositional: '0-21',
        conductDisorder: '0-12',
        perfectionism: '0-12',
        peerRelations: '0-15',
        workingMemory: '0-18',
        executiveFunction: '0-15',
        organization: '0-21',
        emotionalDysregulation: '0-21',
        anxiety: '0-15',
        adhdTotal: '0-129',
        total: '0-330',
      },
    },
  };
}

export function calculateScore(scaleId: string, answers: Record<string, number>): ScoringResult {
  switch (scaleId) {
    case 'gad7-scale':
      return calculateGAD7(answers);
    case 'phq9-scale':
      return calculatePHQ9(answers);
    case 'sas-scale':
      return calculateSAS(answers);
    case 'sds-scale':
      return calculateSDS(answers);
    case 'scl90-scale':
      return calculateSCL90(answers);
    case 'mchat-scale':
      return calculateMCHAT(answers);
    case 'cars-scale':
      return calculateCARS(answers);
    case 'aq-scale':
      return calculateAQ(answers);
    case 'dcdq-scale':
      return calculateDCDQ(answers);
    case 'rcads-scale':
      return calculateRCADS(answers);
    case 'scared-scale':
      return calculateSCARED(answers);
    case 'snapiv-scale':
      return calculateSNAPIV(answers);
    case 'vanderbilt-scale':
      return calculateVANDERBILT(answers);
    case 'conners3-parent-scale':
      return calculateCONNERS3PARENT(answers);
    case 'conners3-teacher-scale':
      return calculateCONNERS3TEACHER(answers);
    case 'srs2-scale':
      return calculateSRS2(answers);
    case 'gars3-scale':
      return calculateGARS3(answers);
    case 'catq-scale':
      return calculateCATQ(answers);
    case 'cati-scale':
      return calculateCATI(answers);
    case 'brown-scale':
      return calculateBrownADD(answers);
    case 'adhdrs-scale':
      return calculateADHDRS(answers);
    case 'caars-simple-scale':
      return calculateCAARSSimple(answers);
    case 'caars-full-scale':
      return calculateCAARSFull(answers);
    case 'dac-scale':
      return calculateDAC(answers);
    case 'ida-scale':
      return calculateIDA(answers);
    case 'hsps-scale':
      return calculateHSPS(answers);
    default:
      return {
        totalScore: 0,
        recommendation: '未知量表类型',
      };
  }
}

export function calculateHSPS(answers: Record<string, number>): ScoringResult {
  // 计算总分（27题，每题1-7分）
  let totalScore = 0;
  for (let i = 1; i <= 27; i++) {
    totalScore += answers[`q${i}`] || 1;
  }
  
  // 计算平均分
  const meanScore = totalScore / 27;
  const roundedMeanScore = parseFloat(meanScore.toFixed(2));
  
  // 评估敏感程度等级
  let sensitivityLevel = '低敏感';
  let recommendation = '';
  
  if (roundedMeanScore < 3) {
    sensitivityLevel = '低敏感';
    recommendation = '你属于低敏感人群，对周围环境刺激的反应相对较弱。';
  } else if (roundedMeanScore < 4.5) {
    sensitivityLevel = '中等敏感';
    recommendation = '你属于中等敏感人群，对周围环境刺激有一定的反应。';
  } else {
    sensitivityLevel = '高度敏感';
    recommendation = '你属于高度敏感人群，对周围环境刺激的反应较为强烈，建议学习一些自我调节的方法。';
  }
  
  return {
    totalScore,
    severity: sensitivityLevel,
    recommendation,
    details: {
      totalScore,
      meanScore: roundedMeanScore,
      sensitivityLevel,
      ranges: {
        total: '27-189',
        mean: '1-7',
      },
    },
  };
}

export function calculateIDA(answers: Record<string, number>): ScoringResult {
  // 计算总分（15题，每题0-1分）
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  // 评估阅读障碍风险等级
  let dyslexiaRisk = '低风险';
  let recommendation = '';
  
  if (totalScore < 5) {
    dyslexiaRisk = '低风险';
    recommendation = '阅读障碍可能性低。';
  } else if (totalScore < 8) {
    dyslexiaRisk = '中等风险';
    recommendation = '存在多个特征，建议进一步确认。';
  } else {
    dyslexiaRisk = '高风险';
    recommendation = '高度可能存在阅读障碍，建议专业评估。';
  }
  
  return {
    totalScore,
    severity: dyslexiaRisk,
    recommendation,
    details: {
      totalScore,
      dyslexiaRisk,
      ranges: {
        total: '0-15',
      },
    },
  };
}

export function calculateDAC(answers: Record<string, number>): ScoringResult {
  // 计算总分（20题，每题0-2分）
  const values = Object.values(answers);
  const totalScore = values.reduce((sum, val) => sum + (val || 0), 0);
  
  // 评估阅读障碍风险等级
  let dyslexiaRisk = '低风险';
  let recommendation = '';
  
  if (totalScore < 5) {
    dyslexiaRisk = '低风险';
    recommendation = '阅读障碍特征不明显，低风险。';
  } else if (totalScore < 15) {
    dyslexiaRisk = '中等风险';
    recommendation = '存在一定阅读障碍特征，中等风险，建议进一步评估。';
  } else {
    dyslexiaRisk = '高风险';
    recommendation = '高度可能存在阅读障碍，高风险，建议专业评估。';
  }
  
  return {
    totalScore,
    severity: dyslexiaRisk,
    recommendation,
    details: {
      totalScore,
      dyslexiaRisk,
      ranges: {
        total: '0-40',
      },
    },
  };
}

export function calculateCAARSFull(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（66题）
  const factors = {
    inattention: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    hyperactivity: [10, 11, 12, 13, 14, 15, 16],
    impulse_emotion: [17, 18, 19, 20, 21, 22, 23, 24, 25],
    problems_self: [26, 27, 28, 29],
    problems_daily: [30, 31, 32, 33, 34, 35, 36, 37],
    aspiration: [38, 39, 40, 41, 42],
    concentration: [43, 44, 45, 46, 47, 48, 49, 50],
    sensation: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66],
  };
  
  // 反向计分题目
  const reverseItems = [47];
  
  // 计算各因子得分
  const factorScores: Record<string, number> = {};
  let totalScore = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    let score = 0;
    items.forEach((num) => {
      let value = answers[`q${num}`] || 0;
      // 处理反向计分
      if (reverseItems.includes(num)) {
        value = 3 - value;
      }
      score += value;
    });
    factorScores[factor] = score;
    totalScore += score;
  });
  
  // 计算ADHD指数（四个核心因子相加）
  const adhdIndexRaw = 
    factorScores.inattention +
    factorScores.hyperactivity +
    factorScores.impulse_emotion +
    factorScores.concentration;
  
  // 计算ADHD指数T分数
  const adhdIndex = 50 + (adhdIndexRaw - 30) * (10 / 15);
  const roundedAdhdIndex = parseFloat(adhdIndex.toFixed(1));
  
  // 评估严重程度
  let severity = '低于平均水平';
  if (roundedAdhdIndex >= 50 && roundedAdhdIndex < 60) {
    severity = '轻度ADHD特征';
  } else if (roundedAdhdIndex >= 60 && roundedAdhdIndex < 70) {
    severity = '中度ADHD特征';
  } else if (roundedAdhdIndex >= 70) {
    severity = '高度ADHD特征';
  }
  
  // 生成建议
  let recommendation = '';
  if (roundedAdhdIndex < 50) {
    recommendation = 'ADHD特征不明显，低于平均水平。';
  } else if (roundedAdhdIndex < 60) {
    recommendation = '存在轻度ADHD特征，建议观察。';
  } else if (roundedAdhdIndex < 70) {
    recommendation = '存在中度ADHD特征，提示可能存在ADHD，建议进一步评估。';
  } else {
    recommendation = '存在高度ADHD特征，高度提示ADHD，建议专业诊断。';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      inattentionScore: factorScores.inattention,
      hyperactivityScore: factorScores.hyperactivity,
      impulseEmotionScore: factorScores.impulse_emotion,
      selfConceptScore: factorScores.problems_self,
      dailyProblemsScore: factorScores.problems_daily,
      aspirationScore: factorScores.aspiration,
      concentrationScore: factorScores.concentration,
      sensationScore: factorScores.sensation,
      totalScore,
      adhdIndex: roundedAdhdIndex,
      severityLevel: severity,
      ranges: {
        inattention: '0-27',
        hyperactivity: '0-21',
        impulse_emotion: '0-27',
        problems_self: '0-12',
        problems_daily: '0-24',
        aspiration: '0-15',
        concentration: '0-24',
        sensation: '0-48',
        total: '0-198',
        adhdIndex: '0-100',
      },
    },
  };
}

export function calculateCAARSSimple(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（26题）
  const factors = {
    inatt_hyper: [1, 2, 3, 4, 5, 6, 7, 8],
    impulse_emotion: [9, 10, 11, 12, 13, 14, 15, 16],
    self_concept: [17, 18, 19, 20],
    sensation: [21, 22, 23, 24, 25, 26],
  };
  
  // 反向计分题目
  const reverseItems = [26];
  
  // 计算各因子得分
  const factorScores: Record<string, number> = {};
  let totalScore = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    let score = 0;
    items.forEach((num) => {
      let value = answers[`q${num}`] || 0;
      // 处理反向计分
      if (reverseItems.includes(num)) {
        value = 3 - value;
      }
      score += value;
    });
    factorScores[factor] = score;
    totalScore += score;
  });
  
  // 计算ADHD指数（T分数）
  const adhdIndex = 50 + (totalScore - 20) * (10 / 10);
  const roundedAdhdIndex = parseFloat(adhdIndex.toFixed(1));
  
  // 评估严重程度
  let severity = '低于平均水平';
  if (roundedAdhdIndex >= 50 && roundedAdhdIndex < 60) {
    severity = '轻度ADHD特征';
  } else if (roundedAdhdIndex >= 60 && roundedAdhdIndex < 70) {
    severity = '中度ADHD特征';
  } else if (roundedAdhdIndex >= 70) {
    severity = '高度ADHD特征';
  }
  
  // 生成建议
  let recommendation = '';
  if (roundedAdhdIndex < 50) {
    recommendation = 'ADHD特征不明显，低于平均水平。';
  } else if (roundedAdhdIndex < 60) {
    recommendation = '存在轻度ADHD特征，建议观察。';
  } else if (roundedAdhdIndex < 70) {
    recommendation = '存在中度ADHD特征，提示可能存在ADHD，建议进一步评估。';
  } else {
    recommendation = '存在高度ADHD特征，高度提示ADHD，建议专业诊断。';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      inattHyperScore: factorScores.inatt_hyper,
      impulseEmotionScore: factorScores.impulse_emotion,
      selfConceptScore: factorScores.self_concept,
      sensationScore: factorScores.sensation,
      totalScore,
      adhdIndex: roundedAdhdIndex,
      severityLevel: severity,
      ranges: {
        inatt_hyper: '0-24',
        impulse_emotion: '0-24',
        self_concept: '0-12',
        sensation: '0-18',
        total: '0-78',
        adhdIndex: '0-100',
      },
    },
  };
}

export function calculateADHDRS(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（18题）
  const factors = {
    inatt: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    hyper: [10, 11, 12, 13, 14, 15, 16, 17, 18],
  };
  
  // 计算各因子得分
  const inattScore = factors.inatt.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const hyperScore = factors.hyper.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  const totalScore = inattScore + hyperScore;
  
  // 计算症状数（得分≥2的题目数）
  const inattSymptomCount = factors.inatt.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  const hyperSymptomCount = factors.hyper.filter(num => (answers[`q${num}`] || 0) >= 2).length;
  
  // 评估ADHD类型
  let adhdPositive = false;
  let adhdType = '无ADHD';
  
  if (inattSymptomCount >= 6 && hyperSymptomCount >= 6) {
    adhdPositive = true;
    adhdType = '混合型ADHD (ADHD-C)';
  } else if (inattSymptomCount >= 6) {
    adhdPositive = true;
    adhdType = '注意缺陷型ADHD (ADHD-I)';
  } else if (hyperSymptomCount >= 6) {
    adhdPositive = true;
    adhdType = '多动冲动型ADHD (ADHD-HI)';
  }
  
  // 评估严重程度
  let severity = '轻度';
  if (totalScore > 12 && totalScore <= 28) {
    severity = '中度';
  } else if (totalScore > 28) {
    severity = '重度';
  }
  
  // 生成建议
  let recommendation = '';
  if (adhdPositive) {
    recommendation = `筛查阳性，${adhdType}，${severity}症状。建议进一步临床评估和诊断。`;
  } else {
    recommendation = '筛查阴性，未达到ADHD诊断标准。如有疑虑，建议咨询专业医生。';
  }
  
  return {
    totalScore,
    severity,
    recommendation,
    details: {
      inattScore,
      hyperScore,
      totalScore,
      inattSymptomCount,
      hyperSymptomCount,
      adhdPositive,
      adhdType,
      severityLevel: severity,
      ranges: {
        inatt: '0-27',
        hyper: '0-27',
        total: '0-54',
      },
    },
  };
}

export function calculateBrownADD(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（40题）
  const factors = {
    activation: [1, 2, 3, 4, 5, 6, 7, 8],
    focus: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    effort: [19, 20, 21, 22, 23, 24, 25, 26, 27],
    emotion: [28, 29, 30, 31, 32, 33],
    memory: [34, 35, 36, 37, 38, 39, 40],
  };
  
  // 计算各因子得分
  const factorScores: Record<string, number> = {};
  let totalRaw = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    const score = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
    factorScores[factor] = score;
    totalRaw += score;
  });
  
  // 评估ADHD症状严重程度
  let adhdSeverity: string;
  let recommendation: string;
  
  if (totalRaw <= 20) {
    adhdSeverity = '无明显ADHD症状';
    recommendation = '症状不明显，基本可以排除ADHD';
  } else if (totalRaw <= 40) {
    adhdSeverity = '轻度ADHD症状';
    recommendation = '存在轻度症状，建议观察';
  } else if (totalRaw <= 60) {
    adhdSeverity = '中度ADHD症状';
    recommendation = '中度症状，建议进一步评估';
  } else {
    adhdSeverity = '重度ADHD症状';
    recommendation = '重度症状，高度怀疑成人ADHD，建议立即诊断评估';
  }
  
  return {
    totalScore: totalRaw,
    severity: adhdSeverity,
    recommendation,
    details: {
      activationScore: factorScores.activation,
      focusScore: factorScores.focus,
      effortScore: factorScores.effort,
      emotionScore: factorScores.emotion,
      memoryScore: factorScores.memory,
      totalRaw,
      adhdSeverity,
      ranges: {
        activation: '0-24',
        focus: '0-30',
        effort: '0-27',
        emotion: '0-18',
        memory: '0-21',
        total: '0-120',
      },
    },
  };
}

export function calculateCATI(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（58题）
  const factors = {
    socialCommunication: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    sensorySensitivity: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    restrictedRepetitive: [24, 25, 26, 27, 28, 29, 30, 31, 32],
    cognitiveEmpathy: [33, 34, 35, 36, 37, 38, 39, 40],
    attentionalShifting: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    intenseInterests: [50, 51, 52, 53, 54, 55, 56, 57, 58],
  };
  
  // 反向计分题目（认知共情因子）
  const reverseItems = [33, 34, 35, 36, 37, 38, 39, 40];
  
  // 计算各因子得分
  const factorScores: Record<string, number> = {};
  let totalRaw = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    let score = 0;
    items.forEach(num => {
      let value = answers[`q${num}`] || 1;
      // 处理反向计分
      if (reverseItems.includes(num)) {
        value = 5 - value;
      }
      score += value;
    });
    factorScores[factor] = score;
    totalRaw += score;
  });
  
  // 评估自闭症特征水平
  let autismTraitLevel: string;
  let recommendation: string;
  
  if (totalRaw <= 100) {
    autismTraitLevel = '低自闭症特征';
    recommendation = '自闭症特征不明显，建议定期观察';
  } else if (totalRaw <= 150) {
    autismTraitLevel = '中等自闭症特征';
    recommendation = '存在一定程度自闭症特征，建议关注相关症状';
  } else {
    autismTraitLevel = '高自闭症特征';
    recommendation = '存在明显自闭症特征，建议进一步评估';
  }
  
  return {
    totalScore: totalRaw,
    severity: autismTraitLevel,
    recommendation,
    details: {
      socialCommunicationScore: factorScores.socialCommunication,
      sensorySensitivityScore: factorScores.sensorySensitivity,
      restrictedRepetitiveScore: factorScores.restrictedRepetitive,
      cognitiveEmpathyScore: factorScores.cognitiveEmpathy,
      attentionalShiftingScore: factorScores.attentionalShifting,
      intenseInterestsScore: factorScores.intenseInterests,
      totalRaw,
      autismTraitLevel,
      ranges: {
        socialCommunication: '12-48',
        sensorySensitivity: '11-44',
        restrictedRepetitive: '9-36',
        cognitiveEmpathy: '8-32',
        attentionalShifting: '9-36',
        intenseInterests: '9-36',
        total: '58-232',
      },
    },
  };
}

export function calculateCATQ(answers: Record<string, number>): ScoringResult {
  // 定义各因子对应的题目（25题）
  const factors = {
    masking: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    compensation: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    assimilation: [19, 20, 21, 22, 23, 24, 25],
  };
  
  // 反向计分题目
  const reverseItems = [17, 25];
  
  // 计算各因子得分
  const factorScores: Record<string, number> = {};
  let totalRaw = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    let score = 0;
    items.forEach(num => {
      let value = answers[`q${num}`] || 1;
      // 处理反向计分
      if (reverseItems.includes(num)) {
        value = 5 - value;
      }
      score += value;
    });
    factorScores[factor] = score;
    totalRaw += score;
  });
  
  // 评估掩饰程度
  let camouflagingLevel: string;
  let recommendation: string;
  
  if (totalRaw <= 40) {
    camouflagingLevel = '低掩饰水平';
    recommendation = '较少使用掩饰策略，建议保持自然状态';
  } else if (totalRaw <= 60) {
    camouflagingLevel = '中等掩饰水平';
    recommendation = '中等程度的掩饰行为，建议关注心理健康';
  } else {
    camouflagingLevel = '高掩饰水平';
    recommendation = '频繁使用掩饰策略，可能增加心理负担，建议寻求专业支持';
  }
  
  return {
    totalScore: totalRaw,
    severity: camouflagingLevel,
    recommendation,
    details: {
      maskingScore: factorScores.masking,
      compensationScore: factorScores.compensation,
      assimilationScore: factorScores.assimilation,
      totalRaw,
      camouflagingLevel,
      ranges: {
        masking: '9-36',
        compensation: '9-36',
        assimilation: '7-28',
        total: '25-100',
      },
    },
  };
}

export function calculateGARS3(answers: Record<string, number>): ScoringResult {
  // 定义各维度对应的题目（56题）
  const factors = {
    stereotyped: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    communication: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    social: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    cognitive: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    adaptation: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    comorbid: [51, 52, 53, 54, 55, 56],
  };
  
  // 计算各维度得分
  const factorScores: Record<string, number> = {};
  let totalRaw = 0;
  
  Object.entries(factors).forEach(([factor, items]) => {
    const score = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
    factorScores[factor] = score;
    totalRaw += score;
  });
  
  // 评估自闭症可能性和严重程度
  let autismProbability: string;
  let severity: string;
  let recommendation: string;
  
  if (totalRaw < 40) {
    autismProbability = '极低';
    severity = '无自闭症特征';
    recommendation = '无自闭症特征，建议定期观察';
  } else if (totalRaw < 60) {
    autismProbability = '低';
    severity = '轻度自闭症特征';
    recommendation = '轻度自闭症特征，建议观察';
  } else if (totalRaw < 80) {
    autismProbability = '中等';
    severity = '中度自闭症特征';
    recommendation = '中度自闭症特征，建议进一步评估';
  } else if (totalRaw < 100) {
    autismProbability = '高';
    severity = '较重度自闭症特征';
    recommendation = '较重度自闭症特征，建议诊断评估';
  } else {
    autismProbability = '极高';
    severity = '重度自闭症特征';
    recommendation = '重度自闭症特征，高度怀疑ASD，建议立即诊断';
  }
  
  return {
    totalScore: totalRaw,
    severity,
    recommendation,
    details: {
      stereotypedScore: factorScores.stereotyped,
      communicationScore: factorScores.communication,
      socialScore: factorScores.social,
      cognitiveScore: factorScores.cognitive,
      adaptationScore: factorScores.adaptation,
      comorbidScore: factorScores.comorbid,
      totalRaw,
      autismProbability,
      ranges: {
        stereotyped: '0-30',
        communication: '0-30',
        social: '0-30',
        cognitive: '0-30',
        adaptation: '0-30',
        comorbid: '0-18',
        total: '0-168',
      },
    },
  };
}

export function calculateSRS2(answers: Record<string, number>): ScoringResult {
  // 计算总分（65题，每题1-4分）
  const values = Object.values(answers);
  const totalRaw = values.reduce((sum, val) => sum + (val || 1), 0);
  
  // 计算T分数（基于常模数据的近似值）
  const tScore = 50 + (totalRaw - 100) * (10 / 30);
  
  // 评估严重程度
  let severity: string;
  let recommendation: string;
  
  if (tScore < 59) {
    severity = '正常范围';
    recommendation = '无明显社交缺陷，建议定期观察';
  } else if (tScore < 65) {
    severity = '轻度社交缺陷';
    recommendation = '轻微社交困难，建议观察';
  } else if (tScore < 75) {
    severity = '中度社交缺陷';
    recommendation = '中度社交困难，建议专业评估';
  } else if (tScore < 85) {
    severity = '重度社交缺陷';
    recommendation = '重度社交困难，建议诊断评估';
  } else {
    severity = '极重度社交缺陷';
    recommendation = '极重度社交缺陷，高度疑似自闭症谱系障碍，建议立即诊断评估';
  }
  
  return {
    totalScore: totalRaw,
    severity,
    recommendation,
    details: {
      totalRaw,
      tScore: parseFloat(tScore.toFixed(1)),
      ranges: {
        total: '65-260',
      },
    },
  };
}

export function calculateCONNERS3TEACHER(answers: Record<string, number>): ScoringResult {
  // 定义各维度对应的题目（105题）
  const factors = {
    inattention: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    hyperactivity: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
    learningProblems: [42, 43, 44, 45, 46, 47, 48],
    aggression: [49, 50, 51, 52, 53, 54, 55],
    oppositional: [56, 57, 58, 59, 60, 61],
    conductDisorder: [62, 63, 64],
    perfectionism: [65, 66, 67, 68],
    peerRelations: [69, 70, 71, 72, 104, 105],
    workingMemory: [73, 74, 75, 76, 77, 78],
    organization: [79, 80, 81, 82, 83, 84, 85, 100, 101, 102],
    emotionalDysregulation: [86, 87, 88, 89, 90],
    anxiety: [91, 92, 93, 94, 95],
    academicImpairment: [96, 97, 98, 99, 103],
  };
  
  // 计算各维度得分
  const factorScores: Record<string, number> = {};
  
  Object.entries(factors).forEach(([factor, items]) => {
    factorScores[factor] = items.reduce((sum, num) => sum + (answers[`q${num}`] || 0), 0);
  });
  
  // 计算ADHD总分
  const adhdTotal = factorScores.inattention + factorScores.hyperactivity;
  
  // 计算T分数（基于常模数据的近似值）
  const inattentionT = 50 + (factorScores.inattention - 21) * (10 / 10.5);
  const hyperactivityT = 50 + (factorScores.hyperactivity - 10) * (10 / 6.5);
  const adhdTotalT = 50 + (adhdTotal - 31) * (10 / 16);
  
  // 评估严重程度
  let severity: string;
  let recommendation: string;
  
  if (inattentionT < 60 && hyperactivityT < 60) {
    severity = '正常范围';
    recommendation = '无需处理，定期观察';
  } else if (inattentionT >= 60 || hyperactivityT >= 60) {
    severity = 'ADHD可疑';
    recommendation = '建议进一步评估';
  } else if (inattentionT >= 65 && hyperactivityT >= 65) {
    severity = 'ADHD高度可疑';
    recommendation = '高度怀疑ADHD，建议诊断评估';
  } else {
    severity = '正常范围';
    recommendation = '无需处理，定期观察';
  }
  
  return {
    totalScore: Object.values(factorScores).reduce((sum, score) => sum + score, 0),
    severity,
    recommendation,
    details: {
      inattentionScore: factorScores.inattention,
      hyperactivityScore: factorScores.hyperactivity,
      learningProblemsScore: factorScores.learningProblems,
      aggressionScore: factorScores.aggression,
      oppositionalScore: factorScores.oppositional,
      conductDisorderScore: factorScores.conductDisorder,
      perfectionismScore: factorScores.perfectionism,
      peerRelationsScore: factorScores.peerRelations,
      workingMemoryScore: factorScores.workingMemory,
      organizationScore: factorScores.organization,
      emotionalDysregulationScore: factorScores.emotionalDysregulation,
      anxietyScore: factorScores.anxiety,
      academicImpairmentScore: factorScores.academicImpairment,
      adhdTotal,
      inattentionT: parseFloat(inattentionT.toFixed(1)),
      hyperactivityT: parseFloat(hyperactivityT.toFixed(1)),
      adhdTotalT: parseFloat(adhdTotalT.toFixed(1)),
      ranges: {
        inattention: '0-84',
        hyperactivity: '0-39',
        learningProblems: '0-21',
        aggression: '0-21',
        oppositional: '0-18',
        conductDisorder: '0-9',
        perfectionism: '0-12',
        peerRelations: '0-18',
        workingMemory: '0-18',
        organization: '0-30',
        emotionalDysregulation: '0-15',
        anxiety: '0-15',
        academicImpairment: '0-15',
        adhdTotal: '0-123',
        total: '0-315',
      },
    },
  };
}
