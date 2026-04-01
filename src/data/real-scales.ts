import { v4 as uuidv4 } from 'uuid';

export interface ScaleQuestion {
  id: string;
  scaleId: string;
  content: string;
  type: string;
  options: Array<{ value: number; label: string }>;
  order: number;
  scoringType?: 'forward' | 'reverse';
  dimension?: string;
}

export interface Scale {
  id: string;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  estimatedTime: number;
  instructions: string;
  resultInterpretation: string;
  isActive: boolean;
}

const gad7Id = 'gad7-scale';
const phq9Id = 'phq9-scale';
const sasId = 'sas-scale';
const sdsId = 'sds-scale';
const scl90Id = 'scl90-scale';
const mchatId = 'mchat-scale';
const carsId = 'cars-scale';
const aqId = 'aq-scale';
const dcdqId = 'dcdq-scale';
const rcadsId = 'rcads-scale';
const scaredId = 'scared-scale';
const snapivId = 'snapiv-scale';
const vanderbiltId = 'vanderbilt-scale';
const conners3ParentId = 'conners3-parent-scale';
const srs2Id = 'srs2-scale';
const gars3Id = 'gars3-scale';
const catqId = 'catq-scale';
const catiId = 'cati-scale';
const brownId = 'brown-scale';
const adhdrsId = 'adhdrs-scale';
const caarsSimpleId = 'caars-simple-scale';
const caarsFullId = 'caars-full-scale';
const dacId = 'dac-scale';
const idaId = 'ida-scale';
const hspsId = 'hsps-scale';

export const scales: Scale[] = [
  {
    id: gad7Id,
    title: 'GAD-7 焦虑筛查量表',
    description: 'GAD-7 是由 Spitzer 等人开发的广泛性焦虑障碍筛查工具，是目前全球最常用的焦虑筛查工具之一。简短易行，信效度良好，适合初级保健机构使用。',
    category: '情绪评估',
    targetAudience: '成年人群',
    estimatedTime: 3,
    instructions: '请根据过去两周内的情况，回答每个问题。每个问题询问过去两周内症状出现的频率。',
    resultInterpretation: '总分0-4分：无焦虑；5-9分：轻度焦虑；10-14分：中度焦虑；15-21分：重度焦虑。总分≥10分为最佳筛查切点。',
    isActive: true,
  },
  {
    id: phq9Id,
    title: 'PHQ-9 抑郁筛查量表',
    description: 'PHQ-9 是基于 DSM-IV 抑郁症诊断标准的简短自评量表，是目前全球最常用的抑郁症筛查工具。用于在初级保健机构中快速筛查抑郁症，评估抑郁严重程度。',
    category: '情绪评估',
    targetAudience: '成年人群',
    estimatedTime: 5,
    instructions: '请根据过去两周内的情况，回答每个问题。每个问题询问过去两周内症状出现的频率。',
    resultInterpretation: '总分0-4分：无抑郁；5-9分：轻度抑郁；10-14分：中度抑郁；15-19分：中重度抑郁；20-27分：重度抑郁。总分≥10分为最佳筛查切点。',
    isActive: true,
  },
  {
    id: sasId,
    title: 'SAS 焦虑自评量表',
    description: 'SAS 由 Zung 于 1971 年编制，与 SDS 配对，是应用最广泛的焦虑自评量表。用于评定焦虑状态病人的主观感受，适用于具有焦虑症状的成年人。',
    category: '情绪评估',
    targetAudience: '成年人',
    estimatedTime: 5,
    instructions: '请根据您最近一周的实际感受，在每个问题后选择一个最符合您情况的选项。',
    resultInterpretation: '标准分<50分：无焦虑；50-58分：轻度焦虑；59-68分：中度焦虑；≥69分：重度焦虑。',
    isActive: true,
  },
  {
    id: sdsId,
    title: 'SDS 抑郁自评量表',
    description: 'SDS 由 Zung 于 1965 年编制，是应用最广泛的抑郁自评量表。适用于发现抑郁症状，衡量抑郁状态轻重程度及其在治疗中的变化。',
    category: '情绪评估',
    targetAudience: '成年人',
    estimatedTime: 5,
    instructions: '请根据您最近一周的实际感受，在每个问题后选择一个最符合您情况的选项。',
    resultInterpretation: '标准分<53分：无抑郁；53-62分：轻度抑郁；63-72分：中度抑郁；≥73分：重度抑郁。',
    isActive: true,
  },
  {
    id: scl90Id,
    title: 'SCL-90 症状自评量表',
    description: 'SCL-90 由 Derogatis 于 1975 年编制，是世界上最常用的心理健康筛查量表之一。量表共90个条目，涵盖比较全面地反映了来访者自觉症状的内容范围。包含9个因子：躯体化、强迫症状、人际关系敏感、抑郁、焦虑、敌对、恐怖、偏执、精神病性。',
    category: '心理健康',
    targetAudience: '16岁以上成人',
    estimatedTime: 20,
    instructions: '请根据最近一周的实际感受，对每个问题进行评分。评分标准：0=没有，1=轻度，2=中度，3=偏重，4=严重。',
    resultInterpretation: '总分≥160或总均分≥1.6提示可能有心理问题，建议进一步评估。因子分≥2提示该维度有异常。',
    isActive: true,
  },
  {
    id: mchatId,
    title: 'M-CHAT 自闭症筛查量表',
    description: 'M-CHAT 是全球最广泛使用的低龄儿童自闭症初筛工具之一，适用于16-30个月婴幼儿的自闭症谱系障碍筛查。',
    category: '发展障碍',
    targetAudience: '16-30个月婴幼儿',
    estimatedTime: 10,
    instructions: '请根据孩子平时的表现回答以下问题。如果孩子的情况符合题目描述，请选择"是"；如果不符合，请选择"否"。',
    resultInterpretation: '第一阶段<3分：低风险；第一阶段≥3分且<7分：中风险，需第二阶段随访；第一阶段≥7分或第二阶段≥2分：高风险，建议立即转介专业ASD诊断评估。',
    isActive: true,
  },
  {
    id: carsId,
    title: 'CARS 儿童自闭症评定量表',
    description: 'CARS 是临床中最常用的自闭症严重程度评估工具之一，适用于2岁以上儿童及成人的自闭症谱系障碍评估。',
    category: '发展障碍',
    targetAudience: '2岁以上儿童及成人',
    estimatedTime: 30,
    instructions: '请根据观察和了解，对每个维度进行评分。评分标准：1=无异常，1.5=轻度异常，2=中度异常，2.5=中重度异常，3=重度异常，4=极重度异常。',
    resultInterpretation: '总分15-29分：非自闭症；30-36分：轻度；37-44分：中度；45-60分：重度。',
    isActive: true,
  },
  {
    id: aqId,
    title: 'AQ 自闭症谱系商数量表',
    description: 'AQ 是最广泛使用的成人自闭症特质自评筛查工具，适用于16岁以上人群的自闭症谱系特质筛查。',
    category: '发展障碍',
    targetAudience: '16岁以上',
    estimatedTime: 15,
    instructions: '请根据您的实际情况，对每个陈述选择最符合您的选项：强烈同意、部分同意、部分不同意、强烈不同意。',
    resultInterpretation: '总分0-25分：低风险；26-31分：中风险；32-50分：高风险，建议转介专业ASD诊断评估。',
    isActive: true,
  },
  {
    id: dcdqId,
    title: 'DCD-Q 发育协调障碍筛查问卷',
    description: 'DCD-Q由Wilson等人于2000年编制，是目前最广泛使用的发育协调障碍（DCD）筛查工具，基于DSM-IV DCD诊断标准。量表共17个条目，包含4个因子，评估儿童在日常运动活动中的表现。',
    category: '发展障碍',
    targetAudience: '5-15岁儿童及青少年',
    estimatedTime: 10,
    instructions: '请根据孩子在日常活动中的表现，选择最符合的描述。注意：得分越低，表示运动协调困难越明显，DCD风险越高。',
    resultInterpretation: '总分17-85分。10-15岁≤52分：高风险（疑似DCD），建议专业运动评估；53-60分：中等风险，建议运动训练观察；>60分：低风险，正常运动发育。',
    isActive: true,
  },
  {
    id: rcadsId,
    title: 'RCADS 儿童焦虑抑郁综合评估量表',
    description: 'RCADS（Revised Children\'s Anxiety and Depression Scale）是由Chorpita等人编制的儿童青少年焦虑抑郁筛查工具，基于DSM-IV诊断标准。量表共47个条目，包含6个因子，评估儿童青少年的焦虑和抑郁症状。',
    category: '情绪评估',
    targetAudience: '8-18岁儿童青少年',
    estimatedTime: 15,
    instructions: '请根据过去两周内的情况，回答每个问题。每个问题询问过去两周内症状出现的频率。',
    resultInterpretation: '焦虑总分0-105分，抑郁总分0-24分。焦虑≥25分：可能存在焦虑；抑郁≥10分：可能存在抑郁。具体等级：焦虑0-24分（无焦虑），25-39分（轻度），40-59分（中度），60分以上（重度）；抑郁0-9分（无抑郁），10-14分（轻度），15-19分（中度），20分以上（重度）。',
    isActive: true,
  },
  {
    id: scaredId,
    title: 'SCARED 儿童焦虑筛查量表',
    description: 'SCARED（Screen for Child Anxiety Related Disorders）由Birmaher等人于1997年编制，是一种儿童和青少年焦虑障碍筛查工具，基于DSM-IV标准。量表共41个条目，包含5个因子，涵盖儿童常见的焦虑障碍类型。',
    category: '情绪评估',
    targetAudience: '8-18岁儿童及青少年',
    estimatedTime: 10,
    instructions: '请根据过去两周内的情况，回答每个问题。每个问题询问过去两周内症状出现的频率。',
    resultInterpretation: '总分0-82分。0-24分：无焦虑；25-34分：轻度焦虑；35-49分：中度焦虑；50-82分：重度焦虑。总分≥25分可能存在焦虑，≥31分高度可能存在焦虑。',
    isActive: true,
  },
  {
    id: snapivId,
    title: 'SNAP-IV 注意缺陷多动障碍症状评估量表（家长版）',
    description: 'SNAP-IV（Swanson, Nolan, and Pelham Version IV）由Swanson等人于1983年编制，基于DSM-IV/DSM-5 ADHD诊断标准，是国内外最广泛使用的ADHD筛查工具。量表包含注意缺陷（9题）、多动-冲动（9题）和对立违抗障碍（8题）三个维度。',
    category: '发育行为评估',
    targetAudience: '6-18岁儿童及青少年',
    estimatedTime: 5,
    instructions: '请根据过去6个月内的情况，回答每个问题。每个问题询问过去6个月内症状出现的频率。',
    resultInterpretation: '注意缺陷和多动-冲动维度均为0-27分。注意缺陷均分≥1.78（家长版）或≥1.33（教师版），多动-冲动均分≥1.44（家长版）或≥1.22（教师版）为筛查阳性。具体等级：<1.0（正常范围），1.0-1.5（轻度可疑），1.5-2.0（中度可疑），>2.0（高度可疑）。',
    isActive: true,
  },
  {
    id: vanderbiltId,
    title: 'VANDERBILT 范德比尔特ADHD筛查量表',
    description: 'VANDERBILT范德比尔特ADHD筛查量表是由国家儿童健康质量研究所（NICHQ）开发的科学验证筛查工具，用于评估6-12岁儿童的注意力缺陷多动障碍（ADHD）。该量表得到美国儿科学会（AAP）的认可，已成为初步评估的黄金标准。',
    category: '发育行为评估',
    targetAudience: '6-12岁儿童',
    estimatedTime: 15,
    instructions: '请根据孩子在过去6个月内的表现，对每个问题进行评分。评分标准：0=从不，1=偶尔，2=经常，3=非常频繁。',
    resultInterpretation: '注意力不集中：9题中至少6题得分≥2；多动/冲动：9题中至少6题得分≥2。同时需要在表现问题上达到一定标准。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: conners3ParentId,
    title: 'Conners3-父母版注意缺陷多动障碍评定量表',
    description: 'Conners3是由C. Keith Conners博士开发的第三版注意缺陷多动障碍评定量表，父母版适用于评估6-18岁儿童青少年的ADHD症状及相关问题。该量表基于DSM-5标准，包含多个维度的评估，是目前国际上广泛使用的ADHD评估工具。',
    category: '发育行为评估',
    targetAudience: '6-18岁儿童及青少年',
    estimatedTime: 20,
    instructions: '请根据孩子在过去6个月内的表现，对每个问题进行评分。评分标准：0=完全没有，1=偶尔有，2=时常有，3=总是有。',
    resultInterpretation: '量表包含多个维度的评估，包括注意力不集中、多动-冲动、执行功能、学习问题、攻击行为、同伴关系和家庭关系等。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: 'conners3-teacher-scale',
    title: 'Conners3-教师版注意缺陷多动障碍评定量表',
    description: 'Conners3是由C. Keith Conners博士开发的第三版注意缺陷多动障碍评定量表，教师版适用于评估6-18岁儿童青少年的ADHD症状及相关问题。该量表基于DSM-5标准，包含多个维度的评估，是目前国际上广泛使用的ADHD评估工具。',
    category: '发育行为评估',
    targetAudience: '6-18岁儿童及青少年',
    estimatedTime: 20,
    instructions: '请根据学生在过去6个月内的表现，对每个问题进行评分。评分标准：0=完全没有，1=偶尔有，2=时常有，3=总是有。',
    resultInterpretation: '量表包含多个维度的评估，包括注意力不集中、多动-冲动、学习问题、攻击行为、对立违抗、品行问题、完美主义、同伴关系、工作记忆、组织计划、情绪失调、焦虑抑郁和学业损害等。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: srs2Id,
    title: 'SRS-2 社交反应能力量表第二版',
    description: 'SRS-2由Constantino等人于2012年编制，是目前全球最广泛使用的自闭症谱系障碍（ASD）社交缺陷量化评估工具。量表基于DSM-5诊断标准，从多个维度量化测量社交沟通能力的损害程度，提供可对比的标准化得分。',
    category: '发展障碍',
    targetAudience: '2.5岁-99岁（儿童/青少年/成人）',
    estimatedTime: 15,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：1=完全不正确（该行为从未发生），2=偶尔正确（约25-30%时间出现），3=经常正确（约50-75%时间出现），4=几乎总是正确（>90%时间出现）。',
    resultInterpretation: '量表包含5个维度的评估，包括社交意识、社交认知、社交沟通、社交动机和自闭症行为方式。得分越高，表示社交缺陷越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: gars3Id,
    title: 'GARS-3 自闭症快速评定量表第三版',
    description: 'GARS-3由James E. Gilliam于2014年修订，是自闭症谱系障碍快速筛查和严重程度评估的标准化工具。基于DSM-5诊断标准，包含6个分量表，适合3-22岁儿童青少年，完成时间短，结果解释方便，是临床和科研常用的快速筛查工具。',
    category: '发展障碍',
    targetAudience: '3-22岁儿童及青少年',
    estimatedTime: 10,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：0=从不（从未出现或几乎不出现），1=很少（偶尔出现，约占时间10%），2=有时（经常出现，约占时间50%），3=经常（非常频繁出现，约占时间90%）。',
    resultInterpretation: '量表包含6个维度的评估，包括刻板行为、沟通、社交互动、认知、适应行为和情绪行为问题。得分越高，自闭症特征越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: catqId,
    title: 'CAT-Q 掩饰自闭症谱系特征问卷',
    description: 'CAT-Q由Hull等人于2018年编制，是专门评估自闭症成年人"掩饰"社交自闭症特征行为的自评问卷。"掩饰"指自闭症个体为了更好地融入社会，主动模仿和学习普通人群的社交行为，掩盖自己的自闭症特征。这种行为可能导致自闭症在临床上被漏诊，同时也会带来额外的心理负担。',
    category: '发展障碍',
    targetAudience: '16岁以上青少年及成人',
    estimatedTime: 5,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：1=完全不符合（该描述完全不符合你），2=有点符合（该描述部分符合你），3=比较符合（该描述大部分符合你），4=完全符合（该描述完全符合你）。',
    resultInterpretation: '量表包含3个因子的评估，包括掩盖/模仿、补偿调整和同化融入。得分越高，掩饰行为越频繁。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: catiId,
    title: 'CATI 全面自闭症谱系特征量表',
    description: 'CATI由Purves等人于2021年编制，是专门为成年人设计的全面自闭症特征自评量表。相比于传统的AQ自闭症谱系量表，CATI覆盖了更广泛的自闭症特征领域，包括：社交沟通、感觉敏感、重复刻板行为、共情能力、注意力转换、兴趣模式六个维度。',
    category: '发展障碍',
    targetAudience: '16岁以上青少年及成人',
    estimatedTime: 10,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：1=完全不同意（该描述完全不符合你），2=稍微同意（该描述有点符合你），3=比较同意（该描述大部分符合你），4=完全同意（该描述完全符合你）。',
    resultInterpretation: '量表包含6个维度的评估，包括社交沟通、感觉敏感、重复刻板行为、认知共情、注意力转换和强烈兴趣。得分越高，自闭症特征越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: brownId,
    title: 'Brown 成人注意力缺陷多动障碍量表',
    description: 'Brown成人ADD量表由Thomas E. Brown编制，是专门为成人ADHD设计的自评量表，涵盖了成人ADHD核心症状维度，包括激活、专注、努力、情绪调节和记忆组织五个方面，是目前成人ADHD临床和研究最常用工具之一。',
    category: '发育行为评估',
    targetAudience: '18岁以上成人',
    estimatedTime: 10,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：0=从未/几乎没有（该症状几乎从不出现），1=偶尔出现（症状有时出现，但不严重），2=经常出现（症状经常出现，有一定影响），3=几乎总是（症状几乎总是存在，影响明显）。',
    resultInterpretation: '量表包含5个维度的评估，包括组织激活、持续专注、努力调节、情绪管理和记忆组织。得分越高，ADHD症状越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: adhdrsId,
    title: 'ADHD-RS-IV ADHD评定量表第四版',
    description: 'ADHD-RS-IV由DuPaul等人基于DSM-IV ADHD诊断标准编制，每个题目直接对应DSM-IV诊断条目中的一条症状，是临床评估ADHD症状严重程度最常用工具之一，适用于儿童到成人各个年龄段。',
    category: '发育行为评估',
    targetAudience: '6岁以上儿童至成人',
    estimatedTime: 5,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：0=没有或从不（症状从不出现），1=偶尔（症状偶尔出现），2=经常（症状经常出现），3=非常频繁（症状几乎总是出现）。',
    resultInterpretation: '量表包含2个维度的评估，包括注意缺陷和多动冲动。得分越高，ADHD症状越严重。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: caarsSimpleId,
    title: 'CAARS-Conners成人ADHD评定量表-简版',
    description: 'CAARS简版是从完整版提取的简短版本，适合快速筛查，包含四个核心因子：注意缺陷/多动、冲动/情绪不稳、自我概念问题、问题性追求新奇。',
    category: '发育行为评估',
    targetAudience: '18岁以上成人',
    estimatedTime: 8,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：0=完全不符合（完全不符合你的情况），1=有点符合（有点符合你的情况），2=比较符合（大部分符合你的情况），3=完全符合（完全符合你的情况）。注意：第26题是反向计分题。',
    resultInterpretation: '量表包含4个维度的评估，包括注意缺陷/多动、冲动/情绪不稳、自我概念问题、追求新奇。ADHD指数（T分数）越高，ADHD特征越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: caarsFullId,
    title: 'CAARS-Conners成人ADHD评定量表-完整版',
    description: 'CAARS完整版由Conners等人于1999年编制，是目前成人ADHD评估最权威的工具之一。完整版包含66个题目，8个因子，涵盖了成人ADHD的核心症状和相关特征，可用于临床诊断、症状严重程度评估和治疗效果监测。',
    category: '发育行为评估',
    targetAudience: '18岁以上成人',
    estimatedTime: 18,
    instructions: '请根据过去6个月内的表现，对每个问题进行评分。评分标准：0=完全不符合（完全不符合你的情况），1=有点符合（有点符合你的情况），2=比较符合（大部分符合你的情况），3=完全符合（完全符合你的情况）。注意：第47题是反向计分题。',
    resultInterpretation: '量表包含8个维度的评估，包括注意缺陷、多动-冲动、冲动/情绪不稳、自我概念问题、日常生活问题、成就动机缺乏、专注力不足、寻求新奇刺激。ADHD指数（T分数）越高，ADHD特征越明显。具体结果请咨询专业医生。',
    isActive: true,
  },
  {
    id: dacId,
    title: '成人阅读障碍检查表-DAC',
    description: '成人阅读障碍检查表是针对成人读写困难（dyslexia，也称为阅读障碍）设计的自评筛查工具，涵盖了成人阅读障碍常见的核心特征：阅读困难、拼写困难、文字处理速度慢、工作记忆问题等。',
    category: '学习障碍评估',
    targetAudience: '16岁以上青少年及成人',
    estimatedTime: 5,
    instructions: '请根据你的实际情况，对每个问题进行评分。评分标准：0=不符合（该描述完全不符合你），1=有些符合（该描述部分符合你），2=完全符合（该描述完全符合你）。',
    resultInterpretation: '量表包含20个题目，评估阅读障碍的核心特征。得分越高，阅读障碍特征越明显。具体结果请咨询专业语言治疗师。',
    isActive: true,
  },
  {
    id: idaId,
    title: 'IDA成人阅读障碍自测题',
    description: '由国际阅读障碍协会（International Dyslexia Association, IDA）提供的成人阅读障碍自测题，共15个是非题，回答"是"得1分，"否"得0分，简单易用，适合快速筛查。',
    category: '学习障碍评估',
    targetAudience: '16岁以上成人',
    estimatedTime: 3,
    instructions: '请根据你的实际情况，对每个问题回答"是"或"否"。回答"是"得1分，"否"得0分。',
    resultInterpretation: '量表包含15个题目，评估阅读障碍的核心特征。得分越高，阅读障碍可能性越大。具体结果请咨询专业语言治疗师。',
    isActive: true,
  },
  {
    id: hspsId,
    title: 'HSPS-27高敏感者量表',
    description: 'HSPS由Elaine N. Aron于1997年编制，是测量"高度敏感"人格特质的经典量表。高度敏感是一种稳定的人格特质，表现为对感官刺激更敏感、加工信息更深入、共情能力更强、对细微变化更觉察。大约15-20%的人群属于高敏感者。',
    category: '人格特质评估',
    targetAudience: '12岁以上',
    estimatedTime: 6,
    instructions: '请根据你的实际情况，对每个问题进行评分。评分标准：1=完全不符合，2=不太符合，3=有点不符合，4=中等符合，5=有点符合，6=比较符合，7=完全符合。',
    resultInterpretation: '量表包含27个题目，评估高度敏感人格特质。得分越高，敏感程度越高。具体结果请咨询专业心理师。',
    isActive: true,
  },
];

const frequencyOptions = [
  { value: 0, label: '完全不会' },
  { value: 1, label: '几天' },
  { value: 2, label: '一半以上天数' },
  { value: 3, label: '几乎每天' },
];

const sasSdsOptions = [
  { value: 1, label: '没有或很少时间' },
  { value: 2, label: '少部分时间' },
  { value: 3, label: '相当多时间' },
  { value: 4, label: '绝大部分或全部时间' },
];

const scl90Options = [
  { value: 0, label: '没有' },
  { value: 1, label: '轻度' },
  { value: 2, label: '中度' },
  { value: 3, label: '偏重' },
  { value: 4, label: '严重' },
];

const mchatOptions = [
  { value: 0, label: '是' },
  { value: 1, label: '否' },
];

const carsOptions = [
  { value: 1, label: '1分 - 正常/年龄适当' },
  { value: 2, label: '2分 - 轻度异常' },
  { value: 3, label: '3分 - 中度异常' },
  { value: 4, label: '4分 - 重度异常' },
];

const aqOptions = [
  { value: 1, label: '强烈同意' },
  { value: 2, label: '部分同意' },
  { value: 3, label: '部分不同意' },
  { value: 4, label: '强烈不同意' },
];

const dcdqOptions = [
  { value: 1, label: '我的孩子做起来非常困难' },
  { value: 2, label: '我的孩子做起来困难' },
  { value: 3, label: '我的孩子做起来有点困难' },
  { value: 4, label: '和别的孩子一样容易' },
  { value: 5, label: '比大多数孩子更容易' },
];

const rcadsOptions = [
  { value: 0, label: '从未' },
  { value: 1, label: '偶尔' },
  { value: 2, label: '时常' },
  { value: 3, label: '总是' },
];

const scaredOptions = [
  { value: 0, label: '没有或几乎不' },
  { value: 1, label: '有时有' },
  { value: 2, label: '经常有' },
];

const snapivOptions = [
  { value: 0, label: '完全没有' },
  { value: 1, label: '偶尔有' },
  { value: 2, label: '时常有' },
  { value: 3, label: '总是有' },
];

const vanderbiltOptions = [
  { value: 0, label: '从不' },
  { value: 1, label: '偶尔' },
  { value: 2, label: '经常' },
  { value: 3, label: '非常频繁' },
];

const conners3Options = [
  { value: 0, label: '完全没有' },
  { value: 1, label: '偶尔有' },
  { value: 2, label: '时常有' },
  { value: 3, label: '总是有' },
];

export const questions: ScaleQuestion[] = [];

// GAD-7 题目
const gad7Questions = [
  '感觉紧张、焦虑或烦躁',
  '不能停止或控制担忧',
  '对各种各样的事情担忧过多',
  '很难放松下来',
  '由于不安而无法静坐',
  '变得容易烦恼或急躁',
  '感到似乎将有可怕的事情发生而害怕',
];

gad7Questions.forEach((content, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: gad7Id,
    content,
    type: 'single',
    options: frequencyOptions,
    order: index + 1,
  });
});

// PHQ-9 题目
const phq9Questions = [
  '做事时提不起劲或没有兴趣',
  '感到心情低落、沮丧或绝望',
  '入睡困难、睡不安或睡眠太多',
  '感觉疲倦或没有活力',
  '食欲不振或吃太多',
  '觉得自己很糟，或觉得自己很失败，或让自己或家人失望',
  '对事物专注有困难，例如阅读报纸或看电视时不能集中注意力',
  '动作或说话速度缓慢到别人已经察觉？或正好相反，烦躁或坐立不安、动来动去的情况更胜于平常',
  '有不如死掉或用某种方式伤害自己的念头',
];

phq9Questions.forEach((content, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: phq9Id,
    content,
    type: 'single',
    options: frequencyOptions,
    order: index + 1,
  });
});

// SAS 题目
const sasQuestions = [
  { text: '我觉得比平常容易紧张和着急', type: 'forward' },
  { text: '我无缘无故地感到害怕', type: 'forward' },
  { text: '我容易心里烦乱或觉得惊恐', type: 'forward' },
  { text: '我觉得我可能将要发疯', type: 'forward' },
  { text: '我觉得一切都很好，也不会发生什么不幸', type: 'reverse' },
  { text: '我手脚发抖打颤', type: 'forward' },
  { text: '我因为头痛、颈痛和背痛而苦恼', type: 'forward' },
  { text: '我感觉容易衰弱和疲乏', type: 'forward' },
  { text: '我觉得心平气和，并且容易安静坐着', type: 'reverse' },
  { text: '我觉得心跳得很快', type: 'forward' },
  { text: '我因为一阵阵头晕而苦恼', type: 'forward' },
  { text: '我有晕倒发作，或觉得要晕倒似的', type: 'forward' },
  { text: '我吸气呼气都感到很容易', type: 'reverse' },
  { text: '我的手脚麻木和刺痛', type: 'forward' },
  { text: '我因为胃痛和消化不良而苦恼', type: 'forward' },
  { text: '我常常要小便', type: 'forward' },
  { text: '我的手脚常常是干燥温暖的', type: 'reverse' },
  { text: '我脸红发热', type: 'forward' },
  { text: '我容易入睡并且一夜睡得很好', type: 'reverse' },
  { text: '我做恶梦', type: 'forward' },
];

sasQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: sasId,
    content: q.text,
    type: 'single',
    options: sasSdsOptions,
    order: index + 1,
    scoringType: q.type,
  });
});

// SDS 题目
const sdsQuestions = [
  { text: '我觉得闷闷不乐，情绪低沉', type: 'forward' },
  { text: '我觉得一天中早晨最好', type: 'reverse' },
  { text: '我一阵阵哭出来或觉得想哭', type: 'forward' },
  { text: '我晚上睡眠不好', type: 'forward' },
  { text: '我吃得跟平常一样多', type: 'reverse' },
  { text: '我与异性密切接触时和以往一样感到愉快', type: 'reverse' },
  { text: '我发觉我的体重在下降', type: 'forward' },
  { text: '我有便秘的苦恼', type: 'forward' },
  { text: '心跳比平常快', type: 'forward' },
  { text: '我无缘无故地感到疲乏', type: 'forward' },
  { text: '我的头脑和平常一样清楚', type: 'reverse' },
  { text: '我觉得经常做的事情并没有困难', type: 'reverse' },
  { text: '我觉得不安而平静不下来', type: 'forward' },
  { text: '我对未来抱有希望', type: 'reverse' },
  { text: '我比平常容易生气激动', type: 'forward' },
  { text: '我觉得自己决定一件事很容易', type: 'reverse' },
  { text: '我觉得自己是个有用的人，有人需要我', type: 'reverse' },
  { text: '我的生活过得很有意思', type: 'reverse' },
  { text: '我认为我死了别人会生活得更好', type: 'forward' },
  { text: '平常感兴趣的事我仍然照样感兴趣', type: 'reverse' },
];

sdsQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: sdsId,
    content: q.text,
    type: 'single',
    options: sasSdsOptions,
    order: index + 1,
    scoringType: q.type,
  });
});

// M-CHAT 题目
const mchatQuestions = [
  '您的孩子会向您请求帮助吗？比如要拿东西够不着时会指或看您？',
  '您的孩子会模仿您做事吗？比如挥手再见、学您做家务？',
  '您的孩子会注视您正在看的东西吗？比如顺着您的目光看向某物？',
  '当您叫孩子名字时，孩子会有反应吗？比如转头看向您或回应',
  '您的孩子会微笑吗？',
  '您的孩子会「呀呀」学语（发出无意义的音节）吗？',
  '您的孩子会走路吗？（或正在学习走路）',
  '您的孩子会用眼睛跟随您移动吗？',
  '您的孩子会指东西给您看吗？比如指向小动物、飞机？',
  '您的孩子会主动寻求您的关注吗？比如叫您、拽您衣角？',
  '您的孩子对其他孩子有反应吗？比如看他们、笑或靠近？',
  '您的孩子会向您展示东西吗？比如把玩具举到您面前？',
  '您的孩子会回应叫名字以外的呼唤吗？比如轻声叫孩子乳名时',
  '您的孩子理解「不」的意思吗？（您说不时孩子会停下手）',
  '您的孩子会玩假想游戏吗？比如给娃娃喂饭、假装打电话？',
  '您的孩子会指向远处的东西给您看吗？您看过后会再看您吗？',
  '您的孩子会自言自语吗？哪怕只是无意义的声音？',
  '您的孩子会自发地靠近其他孩子或大人吗？',
  '您的孩子会主动看您的脸吗？（不是被迫看，而是主动）',
  '您的孩子知道家里常用物品的用途吗？比如勺子、手机、刷子？',
];

mchatQuestions.forEach((content, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: mchatId,
    content,
    type: 'single',
    options: mchatOptions,
    order: index + 1,
  });
});

// CARS 题目（完整15个评定维度）
const carsQuestions = [
  '人际关系：评估与周围人建立情感关系的能力',
  '模仿：评估动作和声音的模仿能力',
  '情感反应：评估情感的适当性、表达方式和强度',
  '肢体运用：评估大运动和精细运动协调性及异常动作',
  '与非生命物体的关系：评估对玩具/物品的使用方式',
  '听觉反应：评估对声音刺激的反应（敏感性/回避/迟钝）',
  '视觉反应：评估目光接触和视觉行为',
  '触觉/味觉/嗅觉反应：评估感官反应的异常性',
  '焦虑与恐惧：评估焦虑和恐惧反应的强度和频率',
  '语言交流：评估语言发育和交流能力',
  '非语言交流：评估非语言交流能力（手势、表情等）',
  '活动水平：评估活动水平（过度活跃/迟钝）',
  '智力功能水平：评估智力发育和各能力均衡性',
  '总体印象：评估整体的自闭症特征',
  '抗拒变化：评估对变化的适应能力',
];

carsQuestions.forEach((content, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: carsId,
    content,
    type: 'single',
    options: carsOptions,
    order: index + 1,
  });
});

// AQ 题目（完整50题）
const aqQuestions = [
  { text: '更喜欢按日程行事', type: 'forward', dimension: 'social_skill' },
  { text: '确保表述足够清晰', type: 'forward', dimension: 'social_skill' },
  { text: '任务间切换困难', type: 'reverse', dimension: 'attention_switch' },
  { text: '更擅长理解字面意思', type: 'forward', dimension: 'social_skill' },
  { text: '很难重新回到原任务', type: 'forward', dimension: 'attention_switch' },
  { text: '单向说话忽略反馈', type: 'forward', dimension: 'communication' },
  { text: '社交场合让对方先开口', type: 'forward', dimension: 'social_skill' },
  { text: '看到椅子会想象其他用途', type: 'reverse', dimension: 'imagination' },
  { text: '很难读懂别人的心思', type: 'forward', dimension: 'social_skill' },
  { text: '很难从一而终完成项目', type: 'forward', dimension: 'attention_switch' },
  { text: '喜欢按固定顺序做事', type: 'forward', dimension: 'attention_switch' },
  { text: '喜欢事前在脑中预演', type: 'forward', dimension: 'attention_switch' },
  { text: '关注整体而非细节', type: 'forward', dimension: 'social_skill' },
  { text: '很难想出有趣话题', type: 'forward', dimension: 'social_skill' },
  { text: '说话更注重准确不重礼貌', type: 'forward', dimension: 'communication' },
  { text: '无法兼顾他人感受和观点', type: 'forward', dimension: 'social_skill' },
  { text: '对话更关注事实而非情感', type: 'forward', dimension: 'communication' },
  { text: '喜欢假装游戏', type: 'reverse', dimension: 'imagination' },
  { text: '有时会说错话无恶意', type: 'forward', dimension: 'social_skill' },
  { text: '喜欢把东西排列整齐', type: 'forward', dimension: 'attention_switch' },
  { text: '很难理解非语言信息', type: 'forward', dimension: 'communication' },
  { text: '多任务同时做会混乱', type: 'reverse', dimension: 'attention_switch' },
  { text: '写的东西难被他人理解', type: 'forward', dimension: 'communication' },
  { text: '轻松想象书中人物外貌动作', type: 'reverse', dimension: 'imagination' },
  { text: '享受社交互动', type: 'reverse', dimension: 'social_skill' },
  { text: '文字表达较困难', type: 'reverse', dimension: 'communication' },
  { text: '不擅长找话题打破沉默', type: 'reverse', dimension: 'attention_switch' },
  { text: '不擅长记笑话', type: 'reverse', dimension: 'communication' },
  { text: '很难想出结束对话方式', type: 'reverse', dimension: 'attention_switch' },
  { text: '不擅长即兴发挥', type: 'forward', dimension: 'imagination' },
  { text: '很难改变做事方式', type: 'forward', dimension: 'imagination' },
  { text: '关注字面忽略意图', type: 'forward', dimension: 'communication' },
  { text: '长时间沉浸思绪忽略周围', type: 'forward', dimension: 'attention_switch' },
  { text: '读书时想象自己是书中人物', type: 'reverse', dimension: 'imagination' },
  { text: '注意到别人忽视的微小图案声音', type: 'forward', dimension: 'attention_detail' },
  { text: '不擅长解释想法', type: 'forward', dimension: 'communication' },
  { text: '不喜欢闲聊', type: 'forward', dimension: 'communication' },
  { text: '对抽象概念更感兴趣', type: 'forward', dimension: 'imagination' },
  { text: '名字被重复叫几次才回应', type: 'forward', dimension: 'attention_detail' },
  { text: '遵循规则比创新更容易', type: 'forward', dimension: 'imagination' },
  { text: '被声音/质地深深吸引', type: 'forward', dimension: 'attention_detail' },
  { text: '会注意到他人忽视的气味', type: 'forward', dimension: 'attention_detail' },
  { text: '看到数字时想到对应颜色', type: 'forward', dimension: 'attention_detail' },
  { text: '很难想出故事结尾', type: 'forward', dimension: 'imagination' },
  { text: '被细节吸引忽略整体', type: 'forward', dimension: 'attention_detail' },
  { text: '被物品特定特征强烈吸引', type: 'forward', dimension: 'attention_detail' },
  { text: '很难判断他人情绪', type: 'reverse', dimension: 'imagination' },
  { text: '很难快速阅读', type: 'forward', dimension: 'attention_detail' },
  { text: '很难听懂歌词的言外之意', type: 'forward', dimension: 'attention_detail' },
  { text: '被某些声音材质分心', type: 'forward', dimension: 'attention_detail' },
];

aqQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: aqId,
    content: q.text,
    type: 'single',
    options: aqOptions,
    order: index + 1,
    scoringType: q.type,
    dimension: q.dimension,
  });
});

// SCL-90 题目（完整90题）
const scl90Questions = [
  '头痛',
  '神经过敏，心中不踏实',
  '头脑中有不必要的想法或字句盘旋',
  '头晕或晕倒',
  '对异性的兴趣减退',
  '对旁人责备求全',
  '感到别人能控制你的思想',
  '感到责怪你',
  '忘性大',
  '担心自己的衣饰整齐及仪态的端正',
  '容易烦恼和激动',
  '胸痛',
  '害怕空旷的场所或街道',
  '感到自己的精力下降，活动减慢',
  '想结束自己的生命',
  '听到旁人听不到的声音',
  '发抖',
  '感到大多数人都不可信任',
  '胃口不好',
  '容易哭泣',
  '同异性相处时感到害羞不自在',
  '感到受骗，中了圈套或有人想抓住你',
  '无缘无故感到害怕',
  '感到孤独',
  '感到苦闷',
  '过分担忧',
  '感到紧张或容易紧张',
  '感到坐立不安心神不定',
  '感到别人不理解你，不同情你',
  '感到对你的友伴中',
  '对什么事都不感兴趣',
  '对事物不感兴趣',
  '对感到你比不上别人',
  '你的身体有麻木或刺痛',
  '感到别人在议论你',
  '感到别人不喜欢你',
  '做事必须慢慢以保证正确',
  '心跳得很厉害',
  '恶心或胃部不舒服',
  '感到比不上他人',
  '肌肉酸痛',
  '感到有人盯著你',
  '感到难以完成任务',
  '难以入睡',
  '做事必须反复检查',
  '难以作出决定',
  '怕乘电车、公共汽车、地铁或火车',
  '呼吸有困难',
  '一阵阵发冷或发热',
  '因为感到害怕而避开某些东西、场合或活动',
  '脑子变空了',
  '身体发麻或刺痛',
  '喉咙有梗塞感',
  '感到对前途没有希望',
  '不能集中注意力',
  '感到身体的某一部分软弱无力',
  '感到紧张或容易紧张',
  '感到手或脚发重',
  '对死亡的想法',
  '吃得太多',
  '当别人看着你或谈论你时感到不自在',
  '有一些不属于你自己的想法',
  '有想打人或伤害他人的冲动',
  '醒得太早',
  '必须反复洗手、点数目或触摸某些东西',
  '睡得不稳不深',
  '有想摔坏或破坏东西的冲动',
  '有一些别人没有的想法或念头',
  '感到对别人神经过敏',
  '在商店或电影院等人多地方感到不自在',
  '感到任何事情都很困难',
  '一阵阵恐惧或惊恐',
  '感到在公共场所吃东西很不舒服',
  '工作学习时常常与人争论',
  '孤独时也感到紧张',
  '别人对你发脾气',
  '在人多的地方感到不自在',
  '即使和别人在一起也感到孤单',
  '感到坐立不安心神不定',
  '感到自己没有什么价值',
  '感到熟悉的东西变成陌生或不像是真的',
  '大叫或摔东西',
  '害怕在公共场所上厕所时感到害怕',
  '思想被卡住',
  '做事不怎么害怕',
  '害怕你会被别人利用',
  '感到你的情感容易受伤',
  '睡眠浅',
  '感到自己有罪',
  '你的思想被别人抢走了',
];

scl90Questions.forEach((content, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: scl90Id,
    content,
    type: 'single',
    options: scl90Options,
    order: index + 1,
  });
});

// DCD-Q 题目（完整17题）
const dcdqQuestions = [
  { text: '用铅笔或钢笔书写和画画', dimension: '精细运动与书写' },
  { text: '用剪刀剪纸', dimension: '精细运动与书写' },
  { text: '书写速度比同龄人慢', dimension: '精细运动与书写' },
  { text: '书写整洁度比同龄人差', dimension: '精细运动与书写' },
  { text: '书写时字母和数字的间距有问题', dimension: '精细运动与书写' },
  { text: '抓住一个球', dimension: '粗大运动' },
  { text: '接住一个球', dimension: '粗大运动' },
  { text: '踢足球时带球跑', dimension: '粗大运动' },
  { text: '骑自行车', dimension: '粗大运动' },
  { text: '跳绳', dimension: '粗大运动' },
  { text: '跑步速度和同龄人一样', dimension: '运动控制' },
  { text: '跑步耐力和同龄人一样', dimension: '运动控制' },
  { text: '跳跃能力和同龄人一样', dimension: '运动控制' },
  { text: '身体平衡能力（如单脚站立）', dimension: '运动控制' },
  { text: '学会新的运动技能比同龄人慢', dimension: '总体协调' },
  { text: '参与体育活动时感到沮丧', dimension: '总体协调' },
  { text: '总体来说，运动协调能力不如同龄人', dimension: '总体协调' },
];

dcdqQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: dcdqId,
    content: q.text,
    type: 'single',
    options: dcdqOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// RCADS 题目（完整47题）
const rcadsQuestions = [
  { text: '我担心事情会出差错', dimension: '广泛性焦虑' },
  { text: '我感到心情愉快/我有好的心情', dimension: '重性抑郁', scoringType: 'reverse' },
  { text: '我担心其他人可能会不喜欢我', dimension: '社交焦虑' },
  { text: '我感到害怕，不需要理由', dimension: '恐慌症' },
  { text: '我感到悲伤或沮丧', dimension: '重性抑郁' },
  { text: '我担心会和小动物、虫子、蛇或其他东西分开', dimension: '分离焦虑' },
  { text: '我担心在测验或考试中表现不好', dimension: '广泛性焦虑' },
  { text: '我担心自己有可怕的想法', dimension: '强迫症' },
  { text: '我担心必须和父母/监护人分开', dimension: '分离焦虑' },
  { text: '我感到紧张不安', dimension: '广泛性焦虑' },
  { text: '我担心在众人面前出丑', dimension: '社交焦虑' },
  { text: '我担心会有不好的事情发生在我身上', dimension: '广泛性焦虑' },
  { text: '我会因为做了某件事而反复检查', dimension: '强迫症' },
  { text: '我担心自己在外面时会和父母/监护人走散', dimension: '分离焦虑' },
  { text: '我因为要做某件事而反复清洗或整理', dimension: '强迫症' },
  { text: '我害怕去学校', dimension: '社交焦虑' },
  { text: '我担心自己的父母会发生不好的事情', dimension: '分离焦虑' },
  { text: '我感到做任何事情都没有动力', dimension: '重性抑郁' },
  { text: '我会感到恐慌，突然心跳加速', dimension: '恐慌症' },
  { text: '我会因为做了某件事而反复问别人同样的问题', dimension: '强迫症' },
  { text: '我害怕在课堂上回答问题', dimension: '社交焦虑' },
  { text: '我会担心自己不如其他孩子', dimension: '社交焦虑' },
  { text: '我会担心必须在学校过夜', dimension: '分离焦虑' },
  { text: '我会担心自己很傻', dimension: '广泛性焦虑' },
  { text: '我感到悲伤或沮丧，什么都不能让我开心', dimension: '重性抑郁' },
  { text: '我害怕乘汽车、公交车、地铁或火车', dimension: '恐慌症' },
  { text: '我会因为做了某件事而在脑中反复想', dimension: '强迫症' },
  { text: '我会担心自己在学校会发生不好的事情', dimension: '分离焦虑' },
  { text: '我感到没有价值或渺小', dimension: '重性抑郁' },
  { text: '我害怕参加需要表现自己的活动', dimension: '社交焦虑' },
  { text: '我会担心自己的父母不爱我', dimension: '分离焦虑' },
  { text: '我会感到恐慌，突然呼吸困难', dimension: '恐慌症' },
  { text: '我感到所有事情都是我的错', dimension: '重性抑郁' },
  { text: '我会因为害怕而无法入睡', dimension: '广泛性焦虑' },
  { text: '我会担心其他人会对我有不好的想法', dimension: '社交焦虑' },
  { text: '我会害怕在人群中', dimension: '恐慌症' },
  { text: '我会感到空虚', dimension: '重性抑郁' },
  { text: '我会担心有不好的事情会发生', dimension: '广泛性焦虑' },
  { text: '我会害怕自己会突然晕倒', dimension: '恐慌症' },
  { text: '我会感到沮丧或不开心', dimension: '重性抑郁' },
  { text: '我会害怕脏东西或细菌', dimension: '强迫症' },
  { text: '我会担心自己在学校没有朋友', dimension: '社交焦虑' },
  { text: '我会担心自己会突然死掉', dimension: '恐慌症' },
  { text: '我会感到疲倦，即使什么都没做', dimension: '重性抑郁' },
  { text: '我会害怕去派对、舞会或其他社交活动', dimension: '社交焦虑' },
  { text: '我会担心自己控制不了自己的想法', dimension: '强迫症' },
  { text: '我会担心在测验或考试中表现不好', dimension: '广泛性焦虑' },
];

rcadsQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: rcadsId,
    content: q.text,
    type: 'single',
    options: rcadsOptions,
    order: index + 1,
    scoringType: q.scoringType,
    dimension: q.dimension,
  });
});

// SCARED 题目（完整41题）
const scaredQuestions = [
  { text: '当我害怕时，我会感到心悸/心跳得很快', dimension: '恐慌/广场恐惧' },
  { text: '当我害怕时，呼吸会变得困难', dimension: '恐慌/广场恐惧' },
  { text: '当我处于害怕的情境时，会感觉不真实', dimension: '恐慌/广场恐惧' },
  { text: '当我害怕时，会感觉快要窒息', dimension: '恐慌/广场恐惧' },
  { text: '我担心自己会突然失去控制或发疯', dimension: '恐慌/广场恐惧' },
  { text: '我担心自己会突然晕倒', dimension: '恐慌/广场恐惧' },
  { text: '我担心自己会突然出现身体上的问题（头疼、胃疼等）', dimension: '恐慌/广场恐惧' },
  { text: '当我害怕时，我会感觉身体发麻或刺痛', dimension: '恐慌/广场恐惧' },
  { text: '我会担心可能会发生可怕的事情', dimension: '广泛性焦虑' },
  { text: '我担心其他人可能会不喜欢我', dimension: '广泛性焦虑' },
  { text: '我担心在测验或考试中表现不好', dimension: '广泛性焦虑' },
  { text: '我担心自己会变傻', dimension: '广泛性焦虑' },
  { text: '我担心会有不好的事情发生在我身上', dimension: '广泛性焦虑' },
  { text: '我会感到紧张不安，总是要动来动去', dimension: '广泛性焦虑' },
  { text: '我会担心事情会出差错', dimension: '广泛性焦虑' },
  { text: '我经常感到忧虑', dimension: '广泛性焦虑' },
  { text: '我对小动物、虫子或高处感到害怕', dimension: '广泛性焦虑' },
  { text: '我担心我的父母可能会发生不好的事情', dimension: '分离焦虑' },
  { text: '我会担心自己在外面时会和父母走散', dimension: '分离焦虑' },
  { text: '我会担心自己会不得不在学校过夜', dimension: '分离焦虑' },
  { text: '我会担心自己在学校会发生不好的事情', dimension: '分离焦虑' },
  { text: '我会担心自己没有其他人做伴', dimension: '分离焦虑' },
  { text: '我会担心必须去参加社交活动或聚会', dimension: '社交焦虑' },
  { text: '我在陌生人面前会感到害羞', dimension: '社交焦虑' },
  { text: '我在和同龄人说话时会感到紧张', dimension: '社交焦虑' },
  { text: '我在课堂上被老师点名回答时会感到紧张', dimension: '社交焦虑' },
  { text: '我在体育课当着同学面运动时会感到紧张', dimension: '社交焦虑' },
  { text: '我担心在众人面前出丑', dimension: '社交焦虑' },
  { text: '我害怕去学校', dimension: '学校焦虑' },
  { text: '我害怕在课堂上回答问题', dimension: '学校焦虑' },
  { text: '我害怕参加考试', dimension: '学校焦虑' },
  { text: '我害怕上学', dimension: '学校焦虑' },
  { text: '我害怕老师叫我到办公室', dimension: '学校焦虑' },
  { text: '我会担心其他孩子会取笑我', dimension: '社交焦虑' },
  { text: '当其他孩子看着我时，我会感到紧张', dimension: '社交焦虑' },
  { text: '当我害怕时，会感到非常紧张以至于无法思考', dimension: '广泛性焦虑' },
  { text: '我会因为害怕而影响睡眠', dimension: '广泛性焦虑' },
  { text: '我会因为害怕而影响学业', dimension: '广泛性焦虑' },
  { text: '我会因为害怕而影响和朋友的相处', dimension: '广泛性焦虑' },
  { text: '我会因为害怕而影响家人相处', dimension: '广泛性焦虑' },
  { text: '我会因为害怕而影响课外活动/兴趣爱好', dimension: '广泛性焦虑' },
];

scaredQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: scaredId,
    content: q.text,
    type: 'single',
    options: scaredOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// SNAP-IV 题目（完整26题）
const snapivQuestions = [
  // 注意缺陷维度
  { text: '在学校做作业或其他活动时，无法专注于细节之处的错误', dimension: '注意缺陷' },
  { text: '在课业或游戏活动中，无法持续专注于一件事', dimension: '注意缺陷' },
  { text: '当直接对他说话时，似乎没有在听', dimension: '注意缺陷' },
  { text: '不能按照指导完成作业且不会因受指导而失焦', dimension: '注意缺陷' },
  { text: '组织活动有困难', dimension: '注意缺陷' },
  { text: '不喜欢或回避需要持续脑力消耗的任务（如学校作业）', dimension: '注意缺陷' },
  { text: '弄丢东西，如玩具、作业、铅笔、书或工具', dimension: '注意缺陷' },
  { text: '很容易被无关刺激分散注意力', dimension: '注意缺陷' },
  { text: '忘记一些已经做过的事情', dimension: '注意缺陷' },
  // 多动-冲动维度
  { text: '坐着时手脚经常动来动去或扭来扭去', dimension: '多动-冲动' },
  { text: '在课堂或其他需要坐好的场合离开座位', dimension: '多动-冲动' },
  { text: '经常过度地跑或爬，或在不适合的场合如此行为', dimension: '多动-冲动' },
  { text: '在休闲活动中安静地参与有困难', dimension: '多动-冲动' },
  { text: '总是一直动个不停，好像被马达驱动一样', dimension: '多动-冲动' },
  { text: '说话太多', dimension: '多动-冲动' },
  { text: '在问题完成前就脱口说出答案', dimension: '多动-冲动' },
  { text: '在等待或轮流时有困难', dimension: '多动-冲动' },
  { text: '在别人讲话或活动时常打断别人', dimension: '多动-冲动' },
  // 对立违抗障碍维度
  { text: '经常发脾气', dimension: '对立违抗障碍' },
  { text: '经常与大人争吵', dimension: '对立违抗障碍' },
  { text: '经常主动反抗或拒绝遵守大人或规则', dimension: '对立违抗障碍' },
  { text: '经常故意惹恼别人', dimension: '对立违抗障碍' },
  { text: '经常责备别人犯的错或不良行为', dimension: '对立违抗障碍' },
  { text: '经常易怒或易被惹恼', dimension: '对立违抗障碍' },
  { text: '经常愤怒和怨恨', dimension: '对立违抗障碍' },
  { text: '经常怀恨在心或寻求报复', dimension: '对立违抗障碍' },
];

snapivQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: snapivId,
    content: q.text,
    type: 'single',
    options: snapivOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// Conners3-父母版题目
const conners3ParentQuestions = [
  // 注意缺陷（IN）
  { text: '做事不能善始善终', dimension: '注意缺陷' },
  { text: '不能把注意力集中在一件事情上很长时间', dimension: '注意缺陷' },
  { text: '容易分心', dimension: '注意缺陷' },
  { text: '做事情没有条理', dimension: '注意缺陷' },
  { text: '学习或做事很容易走神', dimension: '注意缺陷' },
  { text: '不能完成需要长时间集中注意力的任务', dimension: '注意缺陷' },
  { text: '做家庭作业很慢而且难以集中注意力', dimension: '注意缺陷' },
  { text: '忘记已经开始做的事情', dimension: '注意缺陷' },
  { text: '很难持续努力完成目标', dimension: '注意缺陷' },
  { text: '很难坚持进行需要动脑的活动', dimension: '注意缺陷' },
  { text: '在课堂上难以集中注意力', dimension: '注意缺陷' },
  { text: '做事鲁莽、冲动', dimension: '注意缺陷' },
  { text: '丢东西', dimension: '注意缺陷' },
  { text: '在需要安静的时候，还会跑来跑去、爬高爬低', dimension: '注意缺陷' },
  { text: '似乎总是坐立不安', dimension: '注意缺陷' },
  { text: '离开座位', dimension: '注意缺陷' },
  { text: '在不适当的场合乱跑', dimension: '注意缺陷' },
  { text: '难以安静地坐着', dimension: '注意缺陷' },
  { text: '过度地奔跑和攀爬', dimension: '注意缺陷' },
  { text: '总是动个不停', dimension: '注意缺陷' },
  { text: '说话太多', dimension: '注意缺陷' },
  { text: '打断别人的谈话', dimension: '注意缺陷' },
  { text: '在问题还没说完就抢着回答', dimension: '注意缺陷' },
  { text: '难以按顺序等待', dimension: '注意缺陷' },
  { text: '打断别人正在做的事情', dimension: '注意缺陷' },
  { text: '不能保守秘密', dimension: '注意缺陷' },
  { text: '做事不先想想就冲出去了', dimension: '注意缺陷' },
  // 多动冲动（HI）
  { text: '坐不住，动来动去', dimension: '多动冲动' },
  { text: '手脚动个不停', dimension: '多动冲动' },
  { text: '在座位上扭来扭去', dimension: '多动冲动' },
  { text: '难以安静地玩耍', dimension: '多动冲动' },
  { text: '总是"忙个不停"，好像"被马达驱动着"', dimension: '多动冲动' },
  { text: '冲动地做事', dimension: '多动冲动' },
  { text: '不加思考就行动', dimension: '多动冲动' },
  { text: '一下子情绪就爆发了', dimension: '多动冲动' },
  { text: '情绪变化很快', dimension: '多动冲动' },
  { text: '突然做出一些让你吃惊的事', dimension: '多动冲动' },
  { text: '有要求必须立刻满足', dimension: '多动冲动' },
  { text: '排队等待有困难', dimension: '多动冲动' },
  { text: '打扰别人的活动', dimension: '多动冲动' },
  { text: '在课堂上站起来走动', dimension: '多动冲动' },
  { text: '比同龄人说话声音更大', dimension: '多动冲动' },
  { text: '出风头、炫示', dimension: '多动冲动' },
  // 学习问题（LM）
  { text: '学习成绩不好', dimension: '学习问题' },
  { text: '阅读有困难', dimension: '学习问题' },
  { text: '写作有困难', dimension: '学习问题' },
  { text: '数学有困难', dimension: '学习问题' },
  { text: '拼写有困难', dimension: '学习问题' },
  { text: '在学校跟不上进度', dimension: '学习问题' },
  { text: '学习新东西有困难', dimension: '学习问题' },
  { text: '完成作业有困难', dimension: '学习问题' },
  // 攻击（AG）
  { text: '暴躁易怒', dimension: '攻击' },
  { text: '故意伤害东西', dimension: '攻击' },
  { text: '打架', dimension: '攻击' },
  { text: '威胁别人', dimension: '攻击' },
  { text: '伤害别人', dimension: '攻击' },
  { text: '发脾气', dimension: '攻击' },
  { text: '激怒他人', dimension: '攻击' },
  { text: '骂脏话', dimension: '攻击' },
  { text: '打架斗殴', dimension: '攻击' },
  // 对立违抗（OP）
  { text: '不服从', dimension: '对立违抗' },
  { text: '拒绝遵守规则', dimension: '对立违抗' },
  { text: '故意惹恼别人', dimension: '对立违抗' },
  { text: '把自己的错误推到别人身上', dimension: '对立违抗' },
  { text: '生气和怀恨在心', dimension: '对立违抗' },
  { text: '很容易被惹恼', dimension: '对立违抗' },
  { text: '故意做让别人生气的事', dimension: '对立违抗' },
  // 品行问题（CD）
  { text: '偷窃', dimension: '品行问题' },
  { text: '在家外面撒谎', dimension: '品行问题' },
  { text: '破坏他人财物', dimension: '品行问题' },
  { text: '逃学', dimension: '品行问题' },
  // 完美主义（PS）
  { text: '必须反复检查以确保正确', dimension: '完美主义' },
  { text: '做事情必须完全正确', dimension: '完美主义' },
  { text: '必须把事情做到完美', dimension: '完美主义' },
  { text: '会因为不够完美而重来', dimension: '完美主义' },
  // 同伴关系（PI）
  { text: '不被其他孩子喜欢', dimension: '同伴关系' },
  { text: '别的孩子不跟他/她玩', dimension: '同伴关系' },
  { text: '对其他孩子不友好', dimension: '同伴关系' },
  { text: '难以交到朋友', dimension: '同伴关系' },
  { text: '相处不好', dimension: '同伴关系' },
  // 工作记忆（SL）
  { text: '需要提醒才能记得要做的事', dimension: '工作记忆' },
  { text: '脑子里同时处理几件事情有困难', dimension: '工作记忆' },
  { text: '记得带需要的东西有困难', dimension: '工作记忆' },
  { text: '很难记住指令', dimension: '工作记忆' },
  { text: '很难计划接下来要做的事', dimension: '工作记忆' },
  { text: '很难记住到哪里去做事情', dimension: '工作记忆' },
  // 执行功能（GI）
  { text: '想不出解决问题的方法', dimension: '执行功能' },
  { text: '很难想出不同的办法做事', dimension: '执行功能' },
  { text: '很难对事情进行排序', dimension: '执行功能' },
  { text: '很难组织自己的想法', dimension: '执行功能' },
  { text: '在需要改变计划时有困难', dimension: '执行功能' },
  // 组织能力（FU）
  { text: '很难提前计划', dimension: '组织能力' },
  { text: '很难把事情整理得有条理', dimension: '组织能力' },
  { text: '很难保持物品整齐有序', dimension: '组织能力' },
  { text: '很难记住作业', dimension: '组织能力' },
  { text: '很难把材料整理好', dimension: '组织能力' },
  { text: '很难按时完成作业', dimension: '组织能力' },
  { text: '很难记住作业放在哪里', dimension: '组织能力' },
  // 情绪失调（AD）
  { text: '一点小事就哭', dimension: '情绪失调' },
  { text: '面对很小的挫折就崩溃', dimension: '情绪失调' },
  { text: '对批评过度敏感', dimension: '情绪失调' },
  { text: '情绪爆发', dimension: '情绪失调' },
  { text: '情绪变化很快', dimension: '情绪失调' },
  { text: '容易心烦意乱', dimension: '情绪失调' },
  { text: '很难平静下来', dimension: '情绪失调' },
  // 焦虑（WD）
  { text: '担心很多事情', dimension: '焦虑' },
  { text: '感到悲伤', dimension: '焦虑' },
  { text: '焦虑不安', dimension: '焦虑' },
  { text: '感到不快乐', dimension: '焦虑' },
  { text: '害怕很多东西', dimension: '焦虑' },
];

// 验证题目数量
console.log('Conners3-父母版题目数量:', conners3ParentQuestions.length);

conners3ParentQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: conners3ParentId,
    content: q.text,
    type: 'single',
    options: conners3Options,
    order: index + 1,
    dimension: q.dimension,
  });
});

// VANDERBILT 题目（完整57题）
const vanderbiltQuestions = [
  // 注意缺陷（IN） Q01-Q09
  { text: '无法注意细节，在做作业或其他活动中常粗心犯错', dimension: '注意缺陷' },
  { text: '难以持续专注于任务或游戏活动', dimension: '注意缺陷' },
  { text: '当和他/她说话时，似乎并没有在听', dimension: '注意缺陷' },
  { text: '不能遵循指令，无法完成作业、家务或职责（不是因为反抗或不理解）', dimension: '注意缺陷' },
  { text: '难以组织任务和活动', dimension: '注意缺陷' },
  { text: '逃避、不喜欢或不愿意做需要持续脑力努力的事情（如家庭作业、课堂作业）', dimension: '注意缺陷' },
  { text: '经常丢三落四，弄丢任务或活动需要的东西（比如玩具、作业、铅笔、书）', dimension: '注意缺陷' },
  { text: '很容易被外界刺激分散注意力', dimension: '注意缺陷' },
  { text: '在日常活动中经常忘事', dimension: '注意缺陷' },
  // 多动-冲动（HI） Q10-Q18
  { text: '坐不住，手脚动个不停或在座位上扭来扭去', dimension: '多动-冲动' },
  { text: '在课堂上或其他需要坐着的情况下离开座位', dimension: '多动-冲动' },
  { text: '在不适合的场合过度地跑来跑去、爬高爬低', dimension: '多动-冲动' },
  { text: '难以安静地玩耍或参与休闲活动', dimension: '多动-冲动' },
  { text: '总是忙个不停，好像被马达驱动着一样', dimension: '多动-冲动' },
  { text: '说话过多', dimension: '多动-冲动' },
  { text: '在问题还没说完之前就抢着说出答案', dimension: '多动-冲动' },
  { text: '难以排队等待轮流', dimension: '多动-冲动' },
  { text: '打断他人的对话或活动', dimension: '多动-冲动' },
  // 对立违抗障碍（ODD） Q19-Q26
  { text: '经常发脾气', dimension: '对立违抗障碍' },
  { text: '经常和大人争吵', dimension: '对立违抗障碍' },
  { text: '经常主动反抗或拒绝遵守大人的要求和规则', dimension: '对立违抗障碍' },
  { text: '经常故意惹恼别人', dimension: '对立违抗障碍' },
  { text: '经常把自己的过错归咎于别人', dimension: '对立违抗障碍' },
  { text: '容易生气或容易被别人惹恼', dimension: '对立违抗障碍' },
  { text: '经常生气和怨恨', dimension: '对立违抗障碍' },
  { text: '经常怀恨在心或试图报复', dimension: '对立违抗障碍' },
  // 品行障碍（CD） Q27-Q31
  { text: '经常欺负他人、威胁或恐吓别人', dimension: '品行障碍' },
  { text: '经常挑起打架', dimension: '品行障碍' },
  { text: '对人使用过武器（棍棒、刀、枪、碎玻璃瓶等）', dimension: '品行障碍' },
  { text: '在外面偷过东西而不被人发现', dimension: '品行障碍' },
  { text: '故意放火毁坏财物', dimension: '品行障碍' },
  // 焦虑（ANX） Q32-Q36
  { text: '似乎经常感到害怕或担忧', dimension: '焦虑' },
  { text: '似乎很紧张', dimension: '焦虑' },
  { text: '说担心很多事情', dimension: '焦虑' },
  { text: '担心未来', dimension: '焦虑' },
  { text: '身体经常紧绷、难以放松', dimension: '焦虑' },
  // 抑郁（DEP） Q37-Q41
  { text: '说感到悲伤', dimension: '抑郁' },
  { text: '看起来不快乐或悲伤', dimension: '抑郁' },
  { text: '对做事没有乐趣', dimension: '抑郁' },
  { text: '精力不足', dimension: '抑郁' },
  { text: '感到无望', dimension: '抑郁' },
  // 学习问题（LEARN） Q42-Q45
  { text: '阅读成绩低于年级水平', dimension: '学习问题' },
  { text: '数学成绩低于年级水平', dimension: '学习问题' },
  { text: '书写成绩低于年级水平', dimension: '学习问题' },
  { text: '拼写成绩低于年级水平', dimension: '学习问题' },
  // 功能损害（IMPAIR/IMP） Q46-Q57
  { text: '家庭作业完成质量差', dimension: '功能损害' },
  { text: '学习成绩差', dimension: '功能损害' },
  { text: '课堂表现差', dimension: '功能损害' },
  { text: '跟不上年级进度', dimension: '功能损害' },
  { text: '总体学业成绩', dimension: '功能损害' },
  { text: '和家人相处', dimension: '功能损害' },
  { text: '和其他孩子交往', dimension: '功能损害' },
  { text: '参与课外活动', dimension: '功能损害' },
  { text: '对兄弟姐妹的关系', dimension: '功能损害' },
  { text: '在家里完成家务', dimension: '功能损害' },
  { text: '自理能力', dimension: '功能损害' },
  { text: '和同龄人相处', dimension: '功能损害' },
];

// 验证题目数量
console.log('VANDERBILT题目数量:', vanderbiltQuestions.length);




vanderbiltQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: vanderbiltId,
    content: q.text,
    type: 'single',
    options: vanderbiltOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// Conners3-教师版题目（完整105题）
const conners3TeacherQuestions = [
  // 注意缺陷（IN） Q001-Q028
  { text: '做事不能善始善终', dimension: '注意缺陷' },
  { text: '不能把注意力集中在一件事情上很长时间', dimension: '注意缺陷' },
  { text: '容易分心', dimension: '注意缺陷' },
  { text: '做事情没有条理', dimension: '注意缺陷' },
  { text: '学习或做事很容易走神', dimension: '注意缺陷' },
  { text: '不能完成需要长时间集中注意力的任务', dimension: '注意缺陷' },
  { text: '做课堂作业很慢而且难以集中注意力', dimension: '注意缺陷' },
  { text: '忘记已经开始做的事情', dimension: '注意缺陷' },
  { text: '很难持续努力完成目标', dimension: '注意缺陷' },
  { text: '很难坚持进行需要动脑的活动', dimension: '注意缺陷' },
  { text: '在课堂上难以集中注意力', dimension: '注意缺陷' },
  { text: '做事鲁莽、冲动', dimension: '注意缺陷' },
  { text: '丢东西', dimension: '注意缺陷' },
  { text: '忘记课本/作业', dimension: '注意缺陷' },
  { text: '组织书面作业有困难', dimension: '注意缺陷' },
  { text: '离开座位', dimension: '注意缺陷' },
  { text: '在不适当的场合乱跑', dimension: '注意缺陷' },
  { text: '难以安静地坐着', dimension: '注意缺陷' },
  { text: '过度地奔跑和攀爬', dimension: '注意缺陷' },
  { text: '总是动个不停', dimension: '注意缺陷' },
  { text: '说话太多', dimension: '注意缺陷' },
  { text: '打断别人的谈话', dimension: '注意缺陷' },
  { text: '在问题还没说完就抢着回答', dimension: '注意缺陷' },
  { text: '难以按顺序等待', dimension: '注意缺陷' },
  { text: '打断别人正在做的事情', dimension: '注意缺陷' },
  { text: '不能保持安静', dimension: '注意缺陷' },
  { text: '不假思索就开始做题', dimension: '注意缺陷' },
  { text: '做课堂作业不专心，经常停下来', dimension: '注意缺陷' },
  // 多动-冲动（HI） Q029-Q041
  { text: '坐不住，动来动去', dimension: '多动-冲动' },
  { text: '手脚动个不停', dimension: '多动-冲动' },
  { text: '在座位上扭来扭去', dimension: '多动-冲动' },
  { text: '难以安静地玩耍', dimension: '多动-冲动' },
  { text: '总是"忙个不停"，好像"被马达驱动着"', dimension: '多动-冲动' },
  { text: '冲动地做事', dimension: '多动-冲动' },
  { text: '不加思考就行动', dimension: '多动-冲动' },
  { text: '一下子情绪就爆发了', dimension: '多动-冲动' },
  { text: '情绪变化很快', dimension: '多动-冲动' },
  { text: '突然做出一些让人吃惊的事', dimension: '多动-冲动' },
  { text: '排队等待有困难', dimension: '多动-冲动' },
  { text: '打扰别人的活动', dimension: '多动-冲动' },
  { text: '在课堂上站起来走动', dimension: '多动-冲动' },
  // 学习问题（LM） Q042-Q048
  { text: '学习成绩不好', dimension: '学习问题' },
  { text: '阅读有困难', dimension: '学习问题' },
  { text: '写作有困难', dimension: '学习问题' },
  { text: '数学有困难', dimension: '学习问题' },
  { text: '在课堂上跟不上进度', dimension: '学习问题' },
  { text: '学习新东西有困难', dimension: '学习问题' },
  { text: '完成课堂作业有困难', dimension: '学习问题' },
  // 攻击行为（AG） Q049-Q055
  { text: '暴躁易怒', dimension: '攻击行为' },
  { text: '故意伤害东西', dimension: '攻击行为' },
  { text: '打架', dimension: '攻击行为' },
  { text: '威胁同学', dimension: '攻击行为' },
  { text: '发脾气', dimension: '攻击行为' },
  { text: '激怒他人', dimension: '攻击行为' },
  { text: '扰乱课堂秩序', dimension: '攻击行为' },
  // 对立违抗（OP） Q056-Q061
  { text: '不服从', dimension: '对立违抗' },
  { text: '拒绝遵守班级规则', dimension: '对立违抗' },
  { text: '故意惹恼别人', dimension: '对立违抗' },
  { text: '把自己的错误推到别人身上', dimension: '对立违抗' },
  { text: '很容易被惹恼', dimension: '对立违抗' },
  { text: '故意做让别人生气的事', dimension: '对立违抗' },
  // 品行问题（CD） Q062-Q064
  { text: '偷窃', dimension: '品行问题' },
  { text: '破坏他人财物', dimension: '品行问题' },
  { text: '逃课/旷课', dimension: '品行问题' },
  // 完美主义（PERF） Q065-Q068
  { text: '必须反复检查以确保正确', dimension: '完美主义' },
  { text: '做事情必须完全正确', dimension: '完美主义' },
  { text: '必须把事情做到完美', dimension: '完美主义' },
  { text: '会因为不够完美而重来', dimension: '完美主义' },
  // 同伴关系（PEER） Q069-Q072, Q104-Q105
  { text: '不被其他孩子喜欢', dimension: '同伴关系' },
  { text: '别的孩子不跟他/她玩', dimension: '同伴关系' },
  { text: '对其他孩子不友好', dimension: '同伴关系' },
  { text: '难以交到朋友', dimension: '同伴关系' },
  { text: '在小组活动中合作有困难', dimension: '同伴关系' },
  { text: '在操场上和同学玩有困难', dimension: '同伴关系' },
  // 工作记忆（WM） Q073-Q078
  { text: '需要提醒才能记得要做的事', dimension: '工作记忆' },
  { text: '脑子里同时处理几件事情有困难', dimension: '工作记忆' },
  { text: '记得带需要的东西有困难', dimension: '工作记忆' },
  { text: '很难记住指令', dimension: '工作记忆' },
  { text: '很难计划接下来要做的事', dimension: '工作记忆' },
  { text: '很难记住到哪里去做事情', dimension: '工作记忆' },
  // 组织计划（ORG） Q079-Q085, Q100-Q102
  { text: '很难提前计划', dimension: '组织计划' },
  { text: '很难把事情整理得有条理', dimension: '组织计划' },
  { text: '很难保持物品整齐有序', dimension: '组织计划' },
  { text: '很难记住作业', dimension: '组织计划' },
  { text: '很难把材料整理好', dimension: '组织计划' },
  { text: '很难按时完成作业', dimension: '组织计划' },
  { text: '很难记住作业放在哪里', dimension: '组织计划' },
  { text: '组织作业有困难', dimension: '组织计划' },
  { text: '忘记写作业', dimension: '组织计划' },
  { text: '很难开始写作业', dimension: '组织计划' },
  // 情绪失调（ED） Q086-Q090
  { text: '一点小事就哭', dimension: '情绪失调' },
  { text: '面对很小的挫折就崩溃', dimension: '情绪失调' },
  { text: '对批评过度敏感', dimension: '情绪失调' },
  { text: '情绪爆发', dimension: '情绪失调' },
  { text: '容易心烦意乱', dimension: '情绪失调' },
  // 焦虑抑郁（ANX） Q091-Q095
  { text: '担心很多事情', dimension: '焦虑抑郁' },
  { text: '感到悲伤', dimension: '焦虑抑郁' },
  { text: '焦虑不安', dimension: '焦虑抑郁' },
  { text: '感到不快乐', dimension: '焦虑抑郁' },
  { text: '害怕很多东西', dimension: '焦虑抑郁' },
  // 学业损害（ACAD） Q096-Q099, Q103
  { text: '不完成作业', dimension: '学业损害' },
  { text: '考试成绩不好', dimension: '学业损害' },
  { text: '学习进度慢', dimension: '学业损害' },
  { text: '难以应付学业要求', dimension: '学业损害' },
  { text: '抄写有困难', dimension: '学业损害' },
];

// 验证题目数量
console.log('Conners3-教师版题目数量:', conners3TeacherQuestions.length);

const conners3TeacherId = 'conners3-teacher-scale';

conners3TeacherQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: conners3TeacherId,
    content: q.text,
    type: 'single',
    options: conners3Options,
    order: index + 1,
    dimension: q.dimension,
  });
});

// SRS-2 社交反应能力量表第二版题目（完整65题）
const srs2Questions = [
  // 社交意识（SA）Q01-Q12
  { text: '当他人在谈话时，能意识到对方的反应', dimension: '社交意识' },
  { text: '当他人的情绪发生明显变化时能察觉到', dimension: '社交意识' },
  { text: '知道什么时候该说话，什么时候该安静', dimension: '社交意识' },
  { text: '知道如何在陌生社交场合表现恰当', dimension: '社交意识' },
  { text: '能看懂别人的手势和面部表情', dimension: '社交意识' },
  { text: '能理解别人说话的语气和语调变化含义', dimension: '社交意识' },
  { text: '能意识到自己说话声音太大或太小', dimension: '社交意识' },
  { text: '能理解个人空间距离的概念', dimension: '社交意识' },
  { text: '当进入新环境，能观察别人是怎么做的', dimension: '社交意识' },
  { text: '知道如何礼貌地问候别人', dimension: '社交意识' },
  { text: '开玩笑的时候知道别人是否理解这是玩笑', dimension: '社交意识' },
  { text: '能察觉到别人是否在倾听自己说话', dimension: '社交意识' },
  // 社交认知（SC）Q13-Q25
  { text: '理解手势、表情等非语言信息有困难', dimension: '社交认知' },
  { text: '难以理解别人在想什么或感受什么', dimension: '社交认知' },
  { text: '误解社交线索或社交暗示', dimension: '社交认知' },
  { text: '很难猜到别人接下来可能做什么', dimension: '社交认知' },
  { text: '难以理解为什么事情会让别人生气', dimension: '社交认知' },
  { text: '不知道如何在聚会中开始一段对话', dimension: '社交认知' },
  { text: '难以加入正在进行的游戏或活动', dimension: '社交认知' },
  { text: '难以和年龄相仿的孩子一起玩', dimension: '社交认知' },
  { text: '难以适应日常安排的改变', dimension: '社交认知' },
  { text: '很难理解规则的变化', dimension: '社交认知' },
  { text: '交朋友有困难', dimension: '社交认知' },
  { text: '很难理解别人的观点', dimension: '社交认知' },
  { text: '不知道该说什么来吸引别人注意', dimension: '社交认知' },
  // 社交沟通（SCm）Q26-Q42
  { text: '发起对话有困难', dimension: '社交沟通' },
  { text: '维持对话有困难', dimension: '社交沟通' },
  { text: '目光接触异常（过多或过少）', dimension: '社交沟通' },
  { text: '使用手势进行沟通有困难', dimension: '社交沟通' },
  { text: '说话语调、节奏变化不自然', dimension: '社交沟通' },
  { text: '说话内容和面部表情不一致', dimension: '社交沟通' },
  { text: '重复说相同的话有困难', dimension: '社交沟通' },
  { text: '对别人的打招呼没有回应', dimension: '社交沟通' },
  { text: '说话方式生硬，像机器人一样', dimension: '社交沟通' },
  { text: '不看对方眼睛说话', dimension: '社交沟通' },
  { text: '难以表达自己的感受', dimension: '社交沟通' },
  { text: '较少和别人分享自己的兴趣', dimension: '社交沟通' },
  { text: '较少主动发起社交互动', dimension: '社交沟通' },
  { text: '当别人和他说话时很少回应', dimension: '社交沟通' },
  { text: '很难对别人产生兴趣', dimension: '社交沟通' },
  { text: '很少参与假装游戏', dimension: '社交沟通' },
  { text: '很难同时和两个人说话', dimension: '社交沟通' },
  // 社交动机（SM）Q43-Q54
  { text: '缺乏与同伴互动的动机', dimension: '社交动机' },
  { text: '避免眼神接触', dimension: '社交动机' },
  { text: '对社交活动不感兴趣', dimension: '社交动机' },
  { text: '宁愿一个人玩也不愿和别人一起玩', dimension: '社交动机' },
  { text: '很少主动去找别的孩子一起玩', dimension: '社交动机' },
  { text: '很少主动参加集体活动', dimension: '社交动机' },
  { text: '在社交场合很少主动开口说话', dimension: '社交动机' },
  { text: '对别人的情感表达很少有回应', dimension: '社交动机' },
  { text: '对别人的邀请很少回应', dimension: '社交动机' },
  { text: '很难理解和朋友之间的友谊意味着什么', dimension: '社交动机' },
  { text: '不关心别人对自己的看法', dimension: '社交动机' },
  { text: '很少主动与他人分享自己的快乐', dimension: '社交动机' },
  // 自闭症行为方式（AM）Q55-Q65
  { text: '坚持相同的日常程序和习惯，改变会很难受', dimension: '自闭症行为方式' },
  { text: '有重复刻板的动作或姿势', dimension: '自闭症行为方式' },
  { text: '对特定兴趣有过度强烈、狭窄的关注', dimension: '自闭症行为方式' },
  { text: '对特定物体或主题有不寻常的强烈依恋', dimension: '自闭症行为方式' },
  { text: '对感官刺激过度敏感（比如声音、触觉、味道）', dimension: '自闭症行为方式' },
  { text: '对感官刺激反应不足', dimension: '自闭症行为方式' },
  { text: '有不寻常的感官兴趣（比如盯着看某个东西）', dimension: '自闭症行为方式' },
  { text: '反复排列物品或将物品按特定顺序摆放', dimension: '自闭症行为方式' },
  { text: '说话内容非常局限，总是说同样几件事', dimension: '自闭症行为方式' },
  { text: '对环境中的微小变化非常不安', dimension: '自闭症行为方式' },
  { text: '过分遵循仪式化的社交规则', dimension: '自闭症行为方式' },
];

// 验证题目数量
console.log('SRS-2 社交反应能力量表第二版题目数量:', srs2Questions.length);

// SRS-2 量表选项（1-4分）
const srs2Options = [
  { value: 1, label: '1=完全不正确（该行为从未发生）' },
  { value: 2, label: '2=偶尔正确（约25-30%时间出现）' },
  { value: 3, label: '3=经常正确（约50-75%时间出现）' },
  { value: 4, label: '4=几乎总是正确（>90%时间出现）' },
];

srs2Questions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: srs2Id,
    content: q.text,
    type: 'single',
    options: srs2Options,
    order: index + 1,
    dimension: q.dimension,
  });
});

// GARS-3 自闭症快速评定量表第三版题目（完整56题）
const gars3Questions = [
  // 刻板行为（ST）Q01-Q10
  { text: '摇晃身体（前后来回或左右摇晃身体）', dimension: '刻板行为' },
  { text: '拍手、打手或拍打身体其他部位', dimension: '刻板行为' },
  { text: '用脚尖走路（踮脚行走）', dimension: '刻板行为' },
  { text: '重复无意义的动作或声音', dimension: '刻板行为' },
  { text: '坚持固定的日常程序或仪式，如果改变会烦躁', dimension: '刻板行为' },
  { text: '排列物品或将东西按特定顺序摆放', dimension: '刻板行为' },
  { text: '对特定物品有异常强烈的依恋', dimension: '刻板行为' },
  { text: '对感官刺激（声音/触觉/光线）过度敏感', dimension: '刻板行为' },
  { text: '对某些声音或气味有异常强烈的兴趣', dimension: '刻板行为' },
  { text: '重复说相同的词语或短语', dimension: '刻板行为' },
  // 沟通（CO）Q11-Q20
  { text: '发起对话有困难', dimension: '沟通' },
  { text: '维持对话有困难', dimension: '沟通' },
  { text: '理解别人的非语言信息（手势表情）有困难', dimension: '沟通' },
  { text: '使用恰当的眼神接触有困难', dimension: '沟通' },
  { text: '语调异常，缺乏正常的抑扬顿挫', dimension: '沟通' },
  { text: '理解幽默或讽刺有困难', dimension: '沟通' },
  { text: '说话内容和情境不匹配', dimension: '沟通' },
  { text: '表达自己的感受有困难', dimension: '沟通' },
  { text: '模仿别人的动作有困难', dimension: '沟通' },
  { text: '改变话题有困难', dimension: '沟通' },
  // 社交互动（SO）Q21-Q30
  { text: '缺乏与同龄人互动的兴趣', dimension: '社交互动' },
  { text: '分享自己的快乐或成就有困难', dimension: '社交互动' },
  { text: '对他人的情绪缺乏回应', dimension: '社交互动' },
  { text: '难以理解社交规则', dimension: '社交互动' },
  { text: '难以建立和维持友谊', dimension: '社交互动' },
  { text: '对别人发起的社交互动缺乏回应', dimension: '社交互动' },
  { text: '不喜欢和别的孩子一起玩', dimension: '社交互动' },
  { text: '很难参与假装游戏', dimension: '社交互动' },
  { text: '很少主动发起社交互动', dimension: '社交互动' },
  { text: '不能理解别人的感受', dimension: '社交互动' },
  // 认知（COG）Q31-Q40
  { text: '难以和他人一起关注同一件事情（共同注意）', dimension: '认知' },
  { text: '对假装游戏不感兴趣', dimension: '认知' },
  { text: '理解因果关系有困难', dimension: '认知' },
  { text: '从一个活动转换到另一个活动有困难', dimension: '认知' },
  { text: '很难想出解决问题的不同方法', dimension: '认知' },
  { text: '对特定主题有过度狭窄、强烈的兴趣', dimension: '认知' },
  { text: '难以适应日常生活中的变化', dimension: '认知' },
  { text: '很难理解抽象概念', dimension: '认知' },
  { text: '很难在同一时间关注一件以上事情', dimension: '认知' },
  { text: '学习新东西依赖死记硬背', dimension: '认知' },
  // 适应行为（AD）Q41-Q50
  { text: '自己穿衣有困难', dimension: '适应行为' },
  { text: '自己进食有困难', dimension: '适应行为' },
  { text: '如厕技能没有发展到位', dimension: '适应行为' },
  { text: '整理自己物品有困难', dimension: '适应行为' },
  { text: '遵守家庭/学校规则有困难', dimension: '适应行为' },
  { text: '独立完成日常家务有困难', dimension: '适应行为' },
  { text: '在没有成人帮助下无法出门', dimension: '适应行为' },
  { text: '难以按时完成作业或任务', dimension: '适应行为' },
  { text: '难以自己洗澡', dimension: '适应行为' },
  { text: '很难保持个人物品整洁', dimension: '适应行为' },
  // 情绪行为问题（EM）Q51-Q56
  { text: '经常发脾气或爆发情绪', dimension: '情绪行为问题' },
  { text: '变得焦虑或紧张', dimension: '情绪行为问题' },
  { text: '活动过度/坐不住', dimension: '情绪行为问题' },
  { text: '攻击性行为', dimension: '情绪行为问题' },
  { text: '睡眠问题', dimension: '情绪行为问题' },
  { text: '进食问题', dimension: '情绪行为问题' },
];

// 验证题目数量
console.log('GARS-3 自闭症快速评定量表第三版题目数量:', gars3Questions.length);

// GARS-3 量表选项（0-3分）
const gars3Options = [
  { value: 0, label: '0=从不（从未出现或几乎不出现）' },
  { value: 1, label: '1=很少（偶尔出现，约占时间10%）' },
  { value: 2, label: '2=有时（经常出现，约占时间50%）' },
  { value: 3, label: '3=经常（非常频繁出现，约占时间90%）' },
];

gars3Questions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: gars3Id,
    content: q.text,
    type: 'single',
    options: gars3Options,
    order: index + 1,
    dimension: q.dimension,
  });
});

// CAT-Q 掩饰自闭症谱系特征问卷题目（完整25题）
const catqQuestions = [
  // 掩盖/模仿 (Masking/Imitation) Q01-Q09
  { text: '我强迫自己做出眼神接触，但这让我感觉很累', dimension: '掩盖/模仿' },
  { text: '在谈话中，我会有意识地模仿别人的面部表情和手势', dimension: '掩盖/模仿' },
  { text: '我会模仿别人在社交场合中的行为', dimension: '掩盖/模仿' },
  { text: '我练习自己的面部表情和身体语言，以便在社交场合使用', dimension: '掩盖/模仿' },
  { text: '我会有意识地"假装"正常与人相处', dimension: '掩盖/模仿' },
  { text: '我会努力掩盖我的自闭症特征', dimension: '掩盖/模仿' },
  { text: '为了融入社交场合，我会假装我明白了事情实际上我不懂', dimension: '掩盖/模仿' },
  { text: '我会"表演"出一个正常的对话，其实这对我来说并不自然', dimension: '掩盖/模仿' },
  { text: '我会有意识地按照别人期望的行为方式来做事', dimension: '掩盖/模仿' },
  // 补偿调整 (Compensation) Q10-Q18
  { text: '当我不知道该说什么的时候，我会用微笑或点头来应对', dimension: '补偿调整' },
  { text: '我提前想好要说什么，这样才能应对对话', dimension: '补偿调整' },
  { text: '为了社交，我会反复排练要说的话', dimension: '补偿调整' },
  { text: '我会记住别人说过的话，以便以后可以拿来用', dimension: '补偿调整' },
  { text: '我会监控和调整自己说话的方式', dimension: '补偿调整' },
  { text: '我会仔细计划社交互动，提前打好腹稿', dimension: '补偿调整' },
  { text: '为了避免说错话，我会少说一些话', dimension: '补偿调整' },
  { text: '我很容易就能融入群体对话（反向计分）', dimension: '补偿调整' },
  { text: '我会匹配对方的情绪，做出相应的反应', dimension: '补偿调整' },
  // 同化融入 (Assimilation) Q19-Q25
  { text: '我会尽量让别人不注意到我的社交差异', dimension: '同化融入' },
  { text: '我努力融入社交场合，即使这意味着要做一些不自然的事情', dimension: '同化融入' },
  { text: '即使很累，我也会在社交中努力坚持', dimension: '同化融入' },
  { text: '我会告诉自己不要做某些会让别人注意到我的怪异行为', dimension: '同化融入' },
  { text: '我倾向于不让别人知道我的自闭症特征', dimension: '同化融入' },
  { text: '我会尽量让自己看起来"正常"，这对我来说很重要', dimension: '同化融入' },
  { text: '我觉得做我自己和融入群体没有冲突（反向计分）', dimension: '同化融入' },
];

// 验证题目数量
console.log('CAT-Q 掩饰自闭症谱系特征问卷题目数量:', catqQuestions.length);

// CAT-Q 量表选项（1-4分）
const catqOptions = [
  { value: 1, label: '1=完全不符合（该描述完全不符合你）' },
  { value: 2, label: '2=有点符合（该描述部分符合你）' },
  { value: 3, label: '3=比较符合（该描述大部分符合你）' },
  { value: 4, label: '4=完全符合（该描述完全符合你）' },
];

catqQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: catqId,
    content: q.text,
    type: 'single',
    options: catqOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// CATI 全面自闭症谱系特征量表题目（完整58题）
const catiQuestions = [
  // 社交沟通（SC）Q01-Q12
  { text: '发起对话对我来说很困难', dimension: '社交沟通' },
  { text: '我发现理解讽刺和幽默很困难', dimension: '社交沟通' },
  { text: '我发现和陌生人开始对话很难', dimension: '社交沟通' },
  { text: '我通常不知道该怎么回应别人说的话', dimension: '社交沟通' },
  { text: '我觉得眼神接触很不舒服', dimension: '社交沟通' },
  { text: '聊天的时候，我很难跟上话题的转换', dimension: '社交沟通' },
  { text: '我觉得理解别人的肢体语言很难', dimension: '社交沟通' },
  { text: '在社交场合我常常觉得自己格格不入', dimension: '社交沟通' },
  { text: '我很难理解人们说话背后隐藏的意思', dimension: '社交沟通' },
  { text: '我常常不知道什么时候该笑', dimension: '社交沟通' },
  { text: '我发现闲聊很难', dimension: '社交沟通' },
  { text: '我很难解读别人的情绪', dimension: '社交沟通' },
  // 感觉敏感（SS）Q13-Q23
  { text: '某些声音会让我感到不舒服或焦虑', dimension: '感觉敏感' },
  { text: '我对某些质地的衣物非常敏感', dimension: '感觉敏感' },
  { text: '我会被某些纹理或材质强烈吸引', dimension: '感觉敏感' },
  { text: '强光会让我感到不舒服', dimension: '感觉敏感' },
  { text: '某些气味会让我感到不适或恶心', dimension: '感觉敏感' },
  { text: '我会被某些形状或图案吸引', dimension: '感觉敏感' },
  { text: '我对温度变化比其他人更敏感', dimension: '感觉敏感' },
  { text: '在嘈杂环境中我会感到不知所措', dimension: '感觉敏感' },
  { text: '我会去闻不应该被闻的东西', dimension: '感觉敏感' },
  { text: '我对某些触觉接触过度敏感', dimension: '感觉敏感' },
  { text: '我会刻意去触摸某些物体只是因为它们的质地', dimension: '感觉敏感' },
  // 重复刻板行为（RR）Q24-Q32
  { text: '我需要每天都做某些事情，否则我会不安', dimension: '重复刻板行为' },
  { text: '我坚持相同的日常程序，如果改变会让我不安', dimension: '重复刻板行为' },
  { text: '我会做重复性的身体动作（比如摇晃、踱步）', dimension: '重复刻板行为' },
  { text: '我的言语有重复或语调不寻常', dimension: '重复刻板行为' },
  { text: '我会把东西排列得非常整齐，顺序错了会不舒服', dimension: '重复刻板行为' },
  { text: '我对规则和秩序有强烈需求', dimension: '重复刻板行为' },
  { text: '当我焦虑时会做重复行为让自己平静下来', dimension: '重复刻板行为' },
  { text: '我很难接受计划的突然改变', dimension: '重复刻板行为' },
  { text: '我有重复的仪式化行为', dimension: '重复刻板行为' },
  // 认知共情（CE）Q33-Q40（全部反向计分）
  { text: '我能很容易理解别人的感受（反向）', dimension: '认知共情' },
  { text: '我能快速察觉到别人是否不开心（反向）', dimension: '认知共情' },
  { text: '我能理解为什么别人会感到受伤（反向）', dimension: '认知共情' },
  { text: '我能意识到我的言论伤害了别人（反向）', dimension: '认知共情' },
  { text: '别人的情绪会影响我（反向）', dimension: '认知共情' },
  { text: '当别人难过时，我知道该怎么做（反向）', dimension: '认知共情' },
  { text: '我能理解不同观点（反向）', dimension: '认知共情' },
  { text: '我注意到别人什么时候感到不舒服（反向）', dimension: '认知共情' },
  // 注意力转换（AS）Q41-Q49
  { text: '很难把注意力从一件事转移到另一件事', dimension: '注意力转换' },
  { text: '当我专注于一件事的时候，很难停下来切换', dimension: '注意力转换' },
  { text: '我一次只能专注于一件事情', dimension: '注意力转换' },
  { text: '被打断会让我感到非常不舒服', dimension: '注意力转换' },
  { text: '当我深度投入某件事时，很难停下来', dimension: '注意力转换' },
  { text: '很难适应日常生活中的意外变化', dimension: '注意力转换' },
  { text: '我会沉浸在一件事里忘记了时间', dimension: '注意力转换' },
  { text: '我很难同时处理多项任务', dimension: '注意力转换' },
  { text: '我很难从自己感兴趣的事情中抽身出来', dimension: '注意力转换' },
  // 强烈兴趣（II）Q50-Q58
  { text: '我有一两个非常强烈的兴趣，占据了我很多时间', dimension: '强烈兴趣' },
  { text: '我的兴趣非常狭窄和特定', dimension: '强烈兴趣' },
  { text: '我会收集关于我的兴趣领域的大量信息', dimension: '强烈兴趣' },
  { text: '了解我的兴趣领域的一切对我来说很重要', dimension: '强烈兴趣' },
  { text: '我会花很多时间学习关于我兴趣的知识', dimension: '强烈兴趣' },
  { text: '我会对某个主题非常着迷，以至于忘记了时间', dimension: '强烈兴趣' },
  { text: '如果不能追求我的兴趣，生活会变得没有意义', dimension: '强烈兴趣' },
  { text: '我会被某些特定主题强烈吸引', dimension: '强烈兴趣' },
  { text: '我对某些话题的知识比大多数人多很多', dimension: '强烈兴趣' },
];

// 验证题目数量
console.log('CATI 全面自闭症谱系特征量表题目数量:', catiQuestions.length);

// CATI 量表选项（1-4分）
const catiOptions = [
  { value: 1, label: '1=完全不同意（该描述完全不符合你）' },
  { value: 2, label: '2=稍微同意（该描述有点符合你）' },
  { value: 3, label: '3=比较同意（该描述大部分符合你）' },
  { value: 4, label: '4=完全同意（该描述完全符合你）' },
];

catiQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: catiId,
    content: q.text,
    type: 'single',
    options: catiOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// Brown 成人注意力缺陷多动障碍量表题目（完整40题）
const brownQuestions = [
  // 组织激活（AC）Q01-Q08
  { text: '开始需要做的任务有困难', dimension: '组织激活' },
  { text: '把需要做的事情拖延到最后一刻', dimension: '组织激活' },
  { text: '推迟做出决定', dimension: '组织激活' },
  { text: '完成项目工作从一个部分到下一部分有困难', dimension: '组织激活' },
  { text: '整理思绪解决问题有困难', dimension: '组织激活' },
  { text: '开始一个新任务依赖别人提醒', dimension: '组织激活' },
  { text: '很难按次序完成多个任务', dimension: '组织激活' },
  { text: '很难让自己去做那些你觉得枯燥或困难的任务', dimension: '组织激活' },
  // 持续专注（FO）Q09-Q18
  { text: '当别人对你说话时，很难集中注意力听', dimension: '持续专注' },
  { text: '在阅读时，很难持续保持注意力', dimension: '持续专注' },
  { text: '思绪容易飘走，很难专注在你想要做的事情上', dimension: '持续专注' },
  { text: '当你需要专注时，很容易被周围的事情分心', dimension: '持续专注' },
  { text: '说话时，你很容易忘记自己本来想说什么', dimension: '持续专注' },
  { text: '在交谈中，你很容易被别的事情打断思路', dimension: '持续专注' },
  { text: '需要集中注意力时，很快就会感到累', dimension: '持续专注' },
  { text: '完成需要持续注意力的任务有困难', dimension: '持续专注' },
  { text: '你会发现自己不由自主地想别的事情', dimension: '持续专注' },
  { text: '很难过滤掉脑子里无关的想法', dimension: '持续专注' },
  // 努力调节（EF）Q19-Q27
  { text: '即使知道该做什么，很难开始行动', dimension: '努力调节' },
  { text: '很难保持清醒和警觉去完成无聊的任务', dimension: '努力调节' },
  { text: '工作中，动力容易消失，很难坚持到底', dimension: '努力调节' },
  { text: '即使休息好了，开始一天的工作还是很难提起精神', dimension: '努力调节' },
  { text: '长时间工作需要比别人更多的休息', dimension: '努力调节' },
  { text: '保持努力持续工作有困难', dimension: '努力调节' },
  { text: '即使是重要的事情，也很难鼓起动力去做', dimension: '努力调节' },
  { text: '需要持续动脑的工作，很快就精力不支', dimension: '努力调节' },
  { text: '很难坚持长期目标', dimension: '努力调节' },
  // 情绪管理（EM）Q28-Q33
  { text: '你很容易被小事激怒', dimension: '情绪管理' },
  { text: '遇到挫折，你很容易感到沮丧', dimension: '情绪管理' },
  { text: '你容易对一些小事反应过度', dimension: '情绪管理' },
  { text: '你发现很难调节自己不快的情绪', dimension: '情绪管理' },
  { text: '在压力情境下，你很容易感到慌乱', dimension: '情绪管理' },
  { text: '情绪波动很大，一会儿高兴一会儿低落', dimension: '情绪管理' },
  // 记忆组织（ME）Q34-Q40
  { text: '你经常忘记东西放在哪里', dimension: '记忆组织' },
  { text: '很难记住约会和要做的事情', dimension: '记忆组织' },
  { text: '很难记住别人告诉你的电话号码', dimension: '记忆组织' },
  { text: '很难同时记住几件事情', dimension: '记忆组织' },
  { text: '你会丢失或放错重要的文件或物品', dimension: '记忆组织' },
  { text: '很难组织好日常事务，让一切有条不紊', dimension: '记忆组织' },
  { text: '很难记住把东西放在哪里', dimension: '记忆组织' },
];

// 验证题目数量
console.log('Brown 成人注意力缺陷多动障碍量表题目数量:', brownQuestions.length);

// Brown 量表选项（0-3分）
const brownOptions = [
  { value: 0, label: '0=从未/几乎没有（该症状几乎从不出现）' },
  { value: 1, label: '1=偶尔出现（症状有时出现，但不严重）' },
  { value: 2, label: '2=经常出现（症状经常出现，有一定影响）' },
  { value: 3, label: '3=几乎总是（症状几乎总是存在，影响明显）' },
];

brownQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: brownId,
    content: q.text,
    type: 'single',
    options: brownOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// ADHD-RS-IV ADHD评定量表第四版题目（完整18题）
const adhdrsQuestions = [
  // 注意缺陷（IN）Q01-Q09
  { text: '做作业或其他活动时难以集中注意力', dimension: '注意缺陷' },
  { text: '做事不能善始善终，不能完成从头到尾', dimension: '注意缺陷' },
  { text: '容易分心，被外界刺激干扰', dimension: '注意缺陷' },
  { text: '难以组织任务和活动', dimension: '注意缺陷' },
  { text: '丢三落四，经常丢失学习或活动必需的东西', dimension: '注意缺陷' },
  { text: '做需要持续用脑的事情时容易逃避或不喜欢', dimension: '注意缺陷' },
  { text: '忘记日常活动该做的事', dimension: '注意缺陷' },
  { text: '在日常生活中丢东西很频繁', dimension: '注意缺陷' },
  { text: '说话时，别人打断会难以维持思路', dimension: '注意缺陷' },
  // 多动冲动（HI）Q10-Q18
  { text: '坐不住，手脚动个不停', dimension: '多动冲动' },
  { text: '在座位上扭来扭去，坐立不安', dimension: '多动冲动' },
  { text: '在需要坐着的时候会离开座位', dimension: '多动冲动' },
  { text: '在不适当的场合过度地跑来跑去爬高爬低', dimension: '多动冲动' },
  { text: '很难安静地坐着参加休闲活动', dimension: '多动冲动' },
  { text: '总是忙个不停，好像被马达驱动着', dimension: '多动冲动' },
  { text: '说话过多，打断别人谈话', dimension: '多动冲动' },
  { text: '问题还没说完就抢着回答', dimension: '多动冲动' },
  { text: '难以按顺序等待轮流', dimension: '多动冲动' },
];

// 验证题目数量
console.log('ADHD-RS-IV ADHD评定量表第四版题目数量:', adhdrsQuestions.length);

// ADHD-RS-IV 量表选项（0-3分）
const adhdrsOptions = [
  { value: 0, label: '0=没有或从不（症状从不出现）' },
  { value: 1, label: '1=偶尔（症状偶尔出现）' },
  { value: 2, label: '2=经常（症状经常出现）' },
  { value: 3, label: '3=非常频繁（症状几乎总是出现）' },
];

adhdrsQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: adhdrsId,
    content: q.text,
    type: 'single',
    options: adhdrsOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// CAARS-Conners成人ADHD评定量表-简版题目（完整26题）
const caarsSimpleQuestions = [
  // 注意缺陷/多动（INH）Q01-Q08
  { text: '很难集中注意力听别人说话', dimension: '注意缺陷/多动' },
  { text: '阅读时很难保持注意力', dimension: '注意缺陷/多动' },
  { text: '很难把事情做完从开始到结束', dimension: '注意缺陷/多动' },
  { text: '整理事情有困难', dimension: '注意缺陷/多动' },
  { text: '很难持续专注于一项任务', dimension: '注意缺陷/多动' },
  { text: '坐着的时候感到坐立不安', dimension: '注意缺陷/多动' },
  { text: '忘记约会或该做的事', dimension: '注意缺陷/多动' },
  { text: '做事情慢吞吞，很难动起来', dimension: '注意缺陷/多动' },
  // 冲动/情绪不稳（IMP）Q09-Q16
  { text: '说话不加思考脱口而出', dimension: '冲动/情绪不稳' },
  { text: '脾气很难控制', dimension: '冲动/情绪不稳' },
  { text: '情绪说变就变', dimension: '冲动/情绪不稳' },
  { text: '遇到小事就烦躁', dimension: '冲动/情绪不稳' },
  { text: '突然感到强烈的愤怒', dimension: '冲动/情绪不稳' },
  { text: '因为冲动做了让自己后悔的事', dimension: '冲动/情绪不稳' },
  { text: '排队等待有困难', dimension: '冲动/情绪不稳' },
  { text: '打断别人的谈话', dimension: '冲动/情绪不稳' },
  // 自我概念问题（SELF）Q17-Q20
  { text: '对自己没有信心', dimension: '自我概念问题' },
  { text: '觉得自己什么都做不好', dimension: '自我概念问题' },
  { text: '对自己不满意', dimension: '自我概念问题' },
  { text: '觉得自己和别人不一样', dimension: '自我概念问题' },
  // 追求新奇（SEN）Q21-Q26（Q26为反向计分）
  { text: '我喜欢刺激和兴奋', dimension: '追求新奇' },
  { text: '我会被新鲜和令人兴奋的事情吸引', dimension: '追求新奇' },
  { text: '我喜欢体验新事物，即使有点冒险', dimension: '追求新奇' },
  { text: '我寻求高强度刺激和兴奋', dimension: '追求新奇' },
  { text: '我会被危险的活动吸引', dimension: '追求新奇' },
  { text: '我觉得我是一个很平静的人（反向计分）', dimension: '追求新奇' },
];

// 验证题目数量
console.log('CAARS-Conners成人ADHD评定量表-简版题目数量:', caarsSimpleQuestions.length);

// CAARS 简版选项（0-3分）
const caarsSimpleOptions = [
  { value: 0, label: '0=完全不符合（完全不符合你的情况）' },
  { value: 1, label: '1=有点符合（有点符合你的情况）' },
  { value: 2, label: '2=比较符合（大部分符合你的情况）' },
  { value: 3, label: '3=完全符合（完全符合你的情况）' },
];

caarsSimpleQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: caarsSimpleId,
    content: q.text,
    type: 'single',
    options: caarsSimpleOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// CAARS-Conners成人ADHD评定量表-完整版题目（完整66题）
const caarsFullQuestions = [
  // 注意缺陷（IN）Q01-Q09
  { text: '很难集中注意力听别人说话', dimension: '注意缺陷' },
  { text: '很难把一篇文章读完', dimension: '注意缺陷' },
  { text: '阅读时很难保持注意力', dimension: '注意缺陷' },
  { text: '很难把事情从头到尾做完', dimension: '注意缺陷' },
  { text: '组织整理事情有困难', dimension: '注意缺陷' },
  { text: '很难持续专注在一项任务或工作上', dimension: '注意缺陷' },
  { text: '需要集中注意力时，很容易被外界干扰', dimension: '注意缺陷' },
  { text: '忘记约会和其他该做的事', dimension: '注意缺陷' },
  { text: '做事情慢吞吞，很难开始行动', dimension: '注意缺陷' },
  // 多动-冲动（HI）Q10-Q16
  { text: '坐不住，手脚动个不停', dimension: '多动-冲动' },
  { text: '坐着的时候也会扭来扭去，坐立不安', dimension: '多动-冲动' },
  { text: '在座位上很难安静地待着', dimension: '多动-冲动' },
  { text: '很难安静地坐着', dimension: '多动-冲动' },
  { text: '总是忙个不停，好像被马达驱动着', dimension: '多动-冲动' },
  { text: '参加聚会或会议时，很难安静地坐着', dimension: '多动-冲动' },
  { text: '总是到处跑、爬上爬下，静不下来', dimension: '多动-冲动' },
  // 冲动/情绪不稳（IMP）Q17-Q25
  { text: '想到什么就说什么，不假思索', dimension: '冲动/情绪不稳' },
  { text: '脾气很难控制', dimension: '冲动/情绪不稳' },
  { text: '情绪变化很快', dimension: '冲动/情绪不稳' },
  { text: '一点小事就会让我烦躁', dimension: '冲动/情绪不稳' },
  { text: '突然会感觉到强烈的愤怒', dimension: '冲动/情绪不稳' },
  { text: '因为冲动，做过让自己后悔的事', dimension: '冲动/情绪不稳' },
  { text: '排队等待轮流有困难', dimension: '冲动/情绪不稳' },
  { text: '忍不住打断别人的谈话', dimension: '冲动/情绪不稳' },
  { text: '当事情不按我的意思来，我很容易发火', dimension: '冲动/情绪不稳' },
  // 自我概念问题（SELF）Q26-Q29
  { text: '我对自己没有信心', dimension: '自我概念问题' },
  { text: '我觉得我做不好任何事情', dimension: '自我概念问题' },
  { text: '我对自己不满意', dimension: '自我概念问题' },
  { text: '我觉得我和其他人不一样', dimension: '自我概念问题' },
  // 日常生活问题（DAILY）Q30-Q37
  { text: '很难按计划完成工作', dimension: '日常生活问题' },
  { text: '很难遵守指示', dimension: '日常生活问题' },
  { text: '很难把东西整理好', dimension: '日常生活问题' },
  { text: '很难持续努力工作', dimension: '日常生活问题' },
  { text: '很难完成书面作业', dimension: '日常生活问题' },
  { text: '做事情常常半途而废', dimension: '日常生活问题' },
  { text: '很难从头至尾完成一份工作报告', dimension: '日常生活问题' },
  { text: '当你需要做一个新的项目，很难开始行动', dimension: '日常生活问题' },
  // 成就动机缺乏（ASP）Q38-Q42
  { text: '我不会去争取更高的职位或更好的工作', dimension: '成就动机缺乏' },
  { text: '我不想去尝试新的责任', dimension: '成就动机缺乏' },
  { text: '我不期待会有什么成就', dimension: '成就动机缺乏' },
  { text: '我不太在乎能不能把事情做好', dimension: '成就动机缺乏' },
  { text: '我不会去主动争取想要的东西', dimension: '成就动机缺乏' },
  // 专注力不足（CONC）Q43-Q50（Q47为反向计分）
  { text: '胡思乱想，很难专注在正在做的事情上', dimension: '专注力不足' },
  { text: '做事情的时候，脑子容易开小差', dimension: '专注力不足' },
  { text: '开车时，很难专注于开车这件事', dimension: '专注力不足' },
  { text: '即使是在开会，也很难专心', dimension: '专注力不足' },
  { text: '我认为我的注意力没有问题（反向计分）', dimension: '专注力不足' },
  { text: '说话时，很容易被别的事情干扰思路', dimension: '专注力不足' },
  { text: '很难在脑海里同时记住几件事情', dimension: '专注力不足' },
  { text: '很难从一个活动换到另一个活动', dimension: '专注力不足' },
  // 寻求新奇刺激（SEN）Q51-Q66
  { text: '我喜欢从事令人兴奋刺激的活动', dimension: '寻求新奇刺激' },
  { text: '我会被新鲜、刺激的事物吸引', dimension: '寻求新奇刺激' },
  { text: '我喜欢体验新事物，即使有点冒险', dimension: '寻求新奇刺激' },
  { text: '我寻求高强度的刺激和兴奋', dimension: '寻求新奇刺激' },
  { text: '我会被危险的活动吸引', dimension: '寻求新奇刺激' },
  { text: '我喜欢开快车', dimension: '寻求新奇刺激' },
  { text: '我喜欢紧张刺激的电影和表演', dimension: '寻求新奇刺激' },
  { text: '我愿意为了刺激去冒点险', dimension: '寻求新奇刺激' },
  { text: '我喜欢去人多热闹的地方', dimension: '寻求新奇刺激' },
  { text: '我喜欢去拥挤的购物中心', dimension: '寻求新奇刺激' },
  { text: '我喜欢参加大型派对', dimension: '寻求新奇刺激' },
  { text: '我喜欢去人多的地方', dimension: '寻求新奇刺激' },
  { text: '我觉得大城市比小城镇更有趣', dimension: '寻求新奇刺激' },
  { text: '我做事情追求刺激', dimension: '寻求新奇刺激' },
  { text: '我喜欢生活中有很多变化', dimension: '寻求新奇刺激' },
  { text: '我总是寻求新奇和刺激', dimension: '寻求新奇刺激' },
];

// 验证题目数量
console.log('CAARS-Conners成人ADHD评定量表-完整版题目数量:', caarsFullQuestions.length);

// CAARS 完整版选项（0-3分）
const caarsFullOptions = [
  { value: 0, label: '0=完全不符合（完全不符合你的情况）' },
  { value: 1, label: '1=有点符合（有点符合你的情况）' },
  { value: 2, label: '2=比较符合（大部分符合你的情况）' },
  { value: 3, label: '3=完全符合（完全符合你的情况）' },
];

caarsFullQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: caarsFullId,
    content: q.text,
    type: 'single',
    options: caarsFullOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// 成人阅读障碍检查表-DAC题目（完整20题）
const dacQuestions = [
  { text: '小时候学习字母发音有困难', dimension: '阅读障碍特征' },
  { text: '现在阅读时，仍然会漏字错字', dimension: '阅读障碍特征' },
  { text: '阅读同一页需要反复读好几次才能理解', dimension: '阅读障碍特征' },
  { text: '拼写单词有困难，经常拼错', dimension: '阅读障碍特征' },
  { text: '写字很慢，需要花很多时间才能写好', dimension: '阅读障碍特征' },
  { text: '阅读速度比同龄人慢很多', dimension: '阅读障碍特征' },
  { text: '理解文字需要比别人更长时间', dimension: '阅读障碍特征' },
  { text: '很难把想法写下来，变成通顺的句子', dimension: '阅读障碍特征' },
  { text: '记不住电话号码、门牌号码等数字信息', dimension: '阅读障碍特征' },
  { text: '记不住人名', dimension: '阅读障碍特征' },
  { text: '方向感不好，容易迷路', dimension: '阅读障碍特征' },
  { text: '学习外语很慢很困难', dimension: '阅读障碍特征' },
  { text: '整理东西，比如整理桌面书架有困难', dimension: '阅读障碍特征' },
  { text: '按照指示一步步做事情有困难', dimension: '阅读障碍特征' },
  { text: '学会开车比别人慢很多', dimension: '阅读障碍特征' },
  { text: '长时间阅读后会感到很累，头疼', dimension: '阅读障碍特征' },
  { text: '看一行文字会觉得字在动，看不清', dimension: '阅读障碍特征' },
  { text: '从小就不喜欢阅读，尽量避免读书', dimension: '阅读障碍特征' },
  { text: '很难准确地发音', dimension: '阅读障碍特征' },
  { text: '家人也有阅读或拼写困难', dimension: '阅读障碍特征' },
];

// 验证题目数量
console.log('成人阅读障碍检查表-DAC题目数量:', dacQuestions.length);

// DAC 量表选项（0-2分）
const dacOptions = [
  { value: 0, label: '0=不符合（该描述完全不符合你）' },
  { value: 1, label: '1=有些符合（该描述部分符合你）' },
  { value: 2, label: '2=完全符合（该描述完全符合你）' },
];

dacQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: dacId,
    content: q.text,
    type: 'single',
    options: dacOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// IDA成人阅读障碍自测题题目（完整15题）
const idaQuestions = [
  { text: '你是否在阅读时有困难，需要读好几遍才能理解？', dimension: '阅读障碍特征' },
  { text: '你是否拼写单词有困难，经常拼错？', dimension: '阅读障碍特征' },
  { text: '你是否在记住日期、人名、电话号码方面有困难？', dimension: '阅读障碍特征' },
  { text: '你是否在个人生活中，经常放错东西，难以找到？', dimension: '阅读障碍特征' },
  { text: '你是否学习第二语言很困难？', dimension: '阅读障碍特征' },
  { text: '你是否学习开车比别人需要更长时间？', dimension: '阅读障碍特征' },
  { text: '你是否方向感不好，容易迷路？', dimension: '阅读障碍特征' },
  { text: '你小时候是否很晚才学会说话？', dimension: '阅读障碍特征' },
  { text: '你小时候，是否很晚才学会认字？', dimension: '阅读障碍特征' },
  { text: '你是否很难记住诗歌歌词？', dimension: '阅读障碍特征' },
  { text: '你是否小时候阅读就比同龄人慢？', dimension: '阅读障碍特征' },
  { text: '你是否在整理安排事情方面有困难？', dimension: '阅读障碍特征' },
  { text: '你是否不喜欢阅读，尽量避免阅读？', dimension: '阅读障碍特征' },
  { text: '你是否在准确发音方面有困难？', dimension: '阅读障碍特征' },
  { text: '你的家人中是否有人有阅读或拼写困难？', dimension: '阅读障碍特征' },
];

// 验证题目数量
console.log('IDA成人阅读障碍自测题题目数量:', idaQuestions.length);

// IDA 量表选项（0=否，1=是）
const idaOptions = [
  { value: 0, label: '0=否' },
  { value: 1, label: '1=是' },
];

idaQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: idaId,
    content: q.text,
    type: 'single',
    options: idaOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

// HSPS-27高敏感者量表题目（完整27题）
const hspsQuestions = [
  { text: '我更容易被别人的情绪影响', dimension: '高度敏感特质' },
  { text: '我更喜欢看那些能引发思考的电影，而不是动作片', dimension: '高度敏感特质' },
  { text: '强光、强烈气味、粗糙的布料、巨大声音会让我感到不舒服', dimension: '高度敏感特质' },
  { text: '突然的惊吓会让我吓到', dimension: '高度敏感特质' },
  { text: '太多事情同时发生会让我感到不知所措', dimension: '高度敏感特质' },
  { text: '哪怕只是去了人多的地方玩一天，我也需要一整天独处来恢复', dimension: '高度敏感特质' },
  { text: '我对疼痛非常敏感', dimension: '高度敏感特质' },
  { text: '比起同时做很多事，我更喜欢一次只做一件事', dimension: '高度敏感特质' },
  { text: '我能注意到别人不容易注意到的细微刺激', dimension: '高度敏感特质' },
  { text: '我不喜欢看有很多暴力镜头的节目', dimension: '高度敏感特质' },
  { text: '当需要同时处理很多事情，我会感到慌乱', dimension: '高度敏感特质' },
  { text: '当我需要跟很多人打交道，我会调整自己以应对，我感到累', dimension: '高度敏感特质' },
  { text: '我更容易起鸡皮疙瘩或者被吓到', dimension: '高度敏感特质' },
  { text: '咖啡让我更加紧张，我不喝太多咖啡', dimension: '高度敏感特质' },
  { text: '我对自己的情绪非常敏感', dimension: '高度敏感特质' },
  { text: '我更喜欢安静不被打扰的环境', dimension: '高度敏感特质' },
  { text: '艺术和音乐对我的影响很深，有时候会让我非常触动', dimension: '高度敏感特质' },
  { text: '当我需要快速做事情，我会感到紧张', dimension: '高度敏感特质' },
  { text: '在别人的情绪影响下，我很容易共情', dimension: '高度敏感特质' },
  { text: '一天里有太多事情发生，我会感到很累很烦躁', dimension: '高度敏感特质' },
  { text: '我尽量避免安排太多事情挤在一起', dimension: '高度敏感特质' },
  { text: '冲突和争吵让我非常不舒服', dimension: '高度敏感特质' },
  { text: '在别人的坏情绪影响下，我很难放松下来', dimension: '高度敏感特质' },
  { text: '我更容易感觉到饥饿，哪怕只是几个小时没吃饭', dimension: '高度敏感特质' },
  { text: '我对气味非常敏感，能闻到别人闻不到的味道', dimension: '高度敏感特质' },
  { text: '我很容易注意到别人的情绪变化', dimension: '高度敏感特质' },
  { text: '我生来就是一个敏感的人', dimension: '高度敏感特质' },
];

// 验证题目数量
console.log('HSPS-27高敏感者量表题目数量:', hspsQuestions.length);

// HSPS 量表选项（1-7分）
const hspsOptions = [
  { value: 1, label: '1=完全不符合' },
  { value: 2, label: '2=不太符合' },
  { value: 3, label: '3=有点不符合' },
  { value: 4, label: '4=中等符合' },
  { value: 5, label: '5=有点符合' },
  { value: 6, label: '6=比较符合' },
  { value: 7, label: '7=完全符合' },
];

hspsQuestions.forEach((q, index) => {
  questions.push({
    id: uuidv4(),
    scaleId: hspsId,
    content: q.text,
    type: 'single',
    options: hspsOptions,
    order: index + 1,
    dimension: q.dimension,
  });
});

export { gad7Id, phq9Id, sasId, sdsId, scl90Id, mchatId, carsId, aqId, dcdqId, rcadsId, scaredId, snapivId, vanderbiltId, conners3ParentId, conners3TeacherId, srs2Id, gars3Id, catqId, catiId, brownId, adhdrsId, caarsSimpleId, caarsFullId, dacId, idaId, hspsId };
