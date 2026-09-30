export type GuideSection = { id:string; title:string; text:string; items?:string[] };
export type Treatment = {
  slug:string; title:string; group:string; description:string; definition:string;
  examination:string; steps:string[]; sections:GuideSection[]; care:string; caution:string;
  related:string[]; diagram?:'implant'|'bridge'|'tmj'; sourceKeys:string[];
};
export const sources:Record<string,{name:string;url:string}> = {
  implant:{name:'FDA · Dental Implants',url:'https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know'},
  guide:{name:'ITI · Computer-Guided Implant Surgery',url:'https://academy.iti.org/academy/consensus-database/consensus-statement/-/consensus/computer-guided-implant-surgery/1213'},
  decay:{name:'NIDCR · Tooth Decay',url:'https://www.nidcr.nih.gov/health-info/tooth-decay'},
  pulp:{name:'AAE · Vital Pulp Therapy Position Statement',url:'https://www.aae.org/specialty/clinical-resources/guidelines-position-statements/'},
  root:{name:'AAE · Root Canal Treatment',url:'https://www.aae.org/patients/root-canal-treatment/'},
  gum:{name:'NIDCR · Periodontal (Gum) Disease',url:'https://www.nidcr.nih.gov/health-info/gum-disease'},
  bridge:{name:'Leeds Teaching Hospitals · Bridges',url:'https://www.leedsth.nhs.uk/patients/resources/bridges/'},
  veneer:{name:'ADA MouthHealthy · Veneers',url:'https://www.mouthhealthy.org/all-topics-a-z/veneers'},
  stm:{name:'STM 지르코니아 표면처리 연구 · 실험실 연구',url:'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003238269'},
  whitening:{name:'ADA MouthHealthy · Teeth Whitening',url:'https://www.mouthhealthy.org/all-topics-a-z/teeth-whitening'},
  wisdom:{name:'ADA MouthHealthy · Wisdom Teeth',url:'https://www.mouthhealthy.org/all-topics-a-z/wisdom-teeth'},
  tmj:{name:'NIDCR · TMD',url:'https://www.nidcr.nih.gov/health-info/tmd'},
  ortho:{name:'ADA MouthHealthy · Braces',url:'https://www.mouthhealthy.org/all-topics-a-z/braces'},
};
export const treatments:Treatment[] = [
  {
    slug:'zirconia-inlay-onlay',title:'지르코니아 인레이·온레이',group:'보철·심미',description:'손상 범위와 남은 치질에 맞춰 부분 수복의 재료·형태·접착 조건을 평가합니다.',definition:'인레이는 치아 안쪽 손상 부위를, 온레이는 필요한 경우 씹는 면의 일부 교두까지 회복하는 부분 수복입니다. 지르코니아는 이러한 수복에 검토할 수 있는 재료 중 하나입니다.',examination:'남은 치질, 교두의 강도, 치수 상태, 필요한 수복물 두께와 교합, 방습 및 접착 가능성을 확인합니다.',steps:['손상 범위 평가','치질 보존과 수복 범위 계획','재료·두께 검토','수복물 제작','표면 준비·접착','교합·경과 확인'],sections:[{id:'selection',title:'재료는 치아 상태에 맞춰 정합니다',text:'레진 수복과 다른 재료의 인레이·온레이, 크라운 등의 선택지를 함께 비교합니다. 모든 손상 치아에 지르코니아 부분 수복이 적절한 것은 아닙니다.'},{id:'surface',title:'표면처리와 접착',text:'보철물 접착면과 치아 측 조건을 함께 확인합니다. 적용 가능한 경우 STM 등의 표면처리를 검토하되, 재료·제작 단계와 접착 시스템에 맞춰 계획합니다.'}],care:'수복물 경계와 교합을 점검하고 치아 사이를 청결하게 관리합니다.',caution:'탈락·파절이나 시림, 추가 치수 치료가 필요할 수 있습니다. 재료만으로 유지기간이나 치료 결과를 보장하지 않습니다.',related:['prosthodontics','stm','resin-build-up','cavity'],sourceKeys:['decay','stm'],
  },
  {
    slug:'implant',title:'임플란트 식립',group:'임플란트',description:'일반 식립부터 발치 후 식립, 뼈이식과 재수술까지 검사 결과에 따른 치료 선택을 안내합니다.',
    definition:'상실된 치아를 회복하기 위해 턱뼈에 인공 치근인 픽스처를 식립하고, 연결 부품과 보철물을 연결하는 치료입니다.',
    examination:'전신질환, 복용약, 흡연 여부와 구강 위생을 확인합니다. 잇몸과 교합을 검사하고 필요한 영상검사로 뼈의 양·형태, 신경관 및 상악동과의 관계를 평가합니다.',
    steps:['건강 상태와 구강 검사','식립 위치·시기 계획','필요한 발치·뼈이식 등 처치','임플란트 식립','회복과 결합 상태 확인','보철물 장착','정기 유지관리'],
    sections:[
      {id:'placement',title:'식립 시기와 방법',text:'일반 임플란트와 발치 후 임플란트는 발치 부위의 감염, 남은 뼈, 잇몸과 초기 고정 가능성에 따라 계획이 달라집니다. 발치와 동시에 식립할지, 회복 후 식립할지를 검사 후 결정합니다.'},
      {id:'graft',title:'뼈이식과 상악동 관련 수술',text:'뼈가 부족하면 뼈이식을 검토합니다. 위턱 어금니 부위에서는 상악동과 남은 뼈의 관계에 따라 추가 수술이 필요할 수 있습니다. 모든 식립에 뼈이식이나 상악동 수술이 필요한 것은 아닙니다.'},
      {id:'revision',title:'기존 임플란트 제거 후 재식립·재수술',text:'염증, 뼈 손실, 위치 문제 또는 픽스처 파절 등을 평가합니다. 기존 임플란트 보존 가능성과 제거 필요성, 감염 조절 및 재식립 시기를 검토하며, 추가 뼈이식이나 다른 회복 방법을 논의할 수 있습니다.'},
      {id:'digital',title:'디지털 가이드를 이용한 식립',text:'CT와 구강 정보를 이용한 사전 계획과 수술용 가이드의 적용 가능성을 검토합니다. 가이드가 모든 절개나 추가 수술을 대신하지는 않습니다.'},
    ],care:'주변 잇몸을 청결하게 관리하고 회복 중에는 안내받은 식사와 위생 지침을 따릅니다. 보철물 장착 이후에도 정기적인 점검이 필요합니다.',
    caution:'감염, 출혈, 신경·상악동 관련 합병증이나 결합 실패가 생길 수 있습니다. 치료기간과 재수술 가능성은 개인의 상태와 회복 경과에 따라 달라집니다.',related:['digital-guided-implant','implant-repair','implant-maintenance'],diagram:'implant',sourceKeys:['implant','guide'],
  },
  {
    slug:'digital-guided-implant',title:'디지털 가이드 임플란트',group:'임플란트',description:'CT와 구강 정보를 바탕으로 식립 위치·방향을 계획하고 수술용 가이드를 사용하는 방법을 설명합니다.',
    definition:'영상자료와 구강 정보를 결합해 임플란트 위치와 방향을 계획하고, 그 계획을 수술에 활용하기 위한 가이드를 제작하는 방법입니다.',
    examination:'골 상태, 잇몸 두께와 형태, 입이 벌어지는 범위, 기존 치아 및 보철 계획을 확인합니다. 영상과 구강 정보의 일치 및 가이드 지지·적합 상태도 검토합니다.',
    steps:['CT 촬영','구강 정보 획득','디지털 식립계획','수술용 가이드 제작','가이드 적합 확인','가이드를 이용한 임플란트 식립'],
    sections:[{id:'planning',title:'계획은 보철물 위치까지 고려합니다',text:'뼈의 양만이 아니라 완성될 치아의 위치, 교합과 주변 구조를 함께 고려합니다. 필요한 경우 치료계획이나 수술 방법을 조정합니다.'},{id:'incision',title:'무절개가 가능한지는 별도 판단합니다',text:'골 상태, 잇몸 상태와 뼈이식 필요 여부에 따라 절개 또는 추가 술식이 필요할 수 있습니다. 가이드를 사용한다고 모든 환자에게 무절개 수술이 가능한 것은 아닙니다.'}],
    care:'수술 후 위생 관리와 경과 확인은 일반 임플란트 식립과 마찬가지로 중요합니다.',caution:'영상과 가이드의 오차, 가이드 적합과 수술 중 상황을 고려해야 합니다. 가이드는 진단과 임상적 판단을 보조하는 도구입니다.',related:['implant','implant-maintenance'],sourceKeys:['guide'],
  },
  {
    slug:'implant-repair',title:'임플란트 문제·수리',group:'임플란트',description:'흔들림, 나사 풀림·파절, 보철물 탈락과 씹을 때 불편감의 원인을 구분하여 평가합니다.',
    definition:'임플란트가 흔들리거나 보철물이 빠졌다고 해서 원인이 같은 것은 아닙니다. 보철물·스크류·어버트먼트와 뼈 속 픽스처 중 어느 부분에 문제가 있는지 구분합니다.',
    examination:'임플란트 종류와 이전 치료 기록을 확인하고 보철물 고정, 스크류 상태, 교합, 주변 잇몸 및 뼈를 검사합니다. 필요한 경우 보철물을 분리하거나 영상검사를 시행합니다.',
    steps:['증상과 이전 치료 확인','문제 부품과 주위 조직 검사','보존·수리 가능성 평가','재조임·수리·교체 또는 추가 치료','교합과 고정 상태 확인','재발 여부 점검'],
    sections:[
      {id:'loosening',title:'“임플란트가 흔들려요” · “나사가 자꾸 풀려요”',text:'스크류 풀림 또는 어버트먼트 풀림, 보철물 연결 문제, 픽스처 자체의 동요 등을 구분합니다. 재조임을 검토하더라도 반복되는 풀림의 원인과 교합을 함께 확인합니다.',items:['스크류 상태와 연결부 평가','적합한 부품·도구를 이용한 스크류 재조임 검토','어버트먼트와 보철물의 적합 확인']},
      {id:'fracture',title:'“임플란트 나사가 부러졌어요”',text:'스크류 파절과 어버트먼트 파절, 픽스처 손상·파절(fixture wall damage/fracture)을 구분합니다. 파절편 제거 가능성, 내부 연결부 손상과 남은 부품 상태에 따라 수리 또는 교체 계획이 달라집니다.'},
      {id:'restoration',title:'“임플란트 보철물이 빠졌어요”',text:'보철물 탈락·파절은 접착이나 고정 방식, 부품 손상과 씹는 힘을 확인해야 합니다. 상태에 따라 보철물 재부착, 수리 또는 교체를 검토합니다. 빠진 보철물은 보관하여 가져오세요.'},
      {id:'pain',title:'“씹을 때 아파요” · “주변에서 피가 나요”',text:'임플란트 교합 문제와 주변 잇몸 염증, 임플란트 주위염 등을 평가합니다. 증상만으로 나사 문제나 염증으로 단정하지 않습니다.'},
      {id:'revision',title:'수리로 해결하기 어려운 경우',text:'픽스처 손상이나 진행된 주위 조직 손상 등은 제거 후 재식립·재수술 또는 다른 회복 방법을 검토할 수 있습니다. 사용 시스템과 부품 확보 여부도 치료 범위에 영향을 줍니다.'},
    ],care:'흔들리는 부분을 직접 조이거나 가정용 접착제를 사용하지 마세요. 해당 부위로 단단한 음식을 씹는 것을 피하고 진료를 통해 원인을 확인하세요.',
    caution:'보철물 흔들림과 픽스처 동요는 다릅니다. 수리가 가능한지는 검사 후 판단하며, 모든 파절이나 반복 풀림을 재조임만으로 해결할 수는 없습니다.',related:['peri-implantitis','implant-maintenance','implant'],diagram:'implant',sourceKeys:['implant'],
  },
  {
    slug:'peri-implantitis',title:'임플란트 주변 잇몸 염증·주위염',group:'임플란트',description:'출혈·붓기와 임플란트 주위 조직의 상태를 확인하고 치료와 유지관리 방향을 안내합니다.',
    definition:'임플란트 주변의 연조직 염증과, 지지하는 뼈의 손실을 동반한 임플란트 주위염을 구분하여 평가합니다.',
    examination:'잇몸 출혈, 고름, 주위 조직 깊이, 구강 위생 및 필요한 영상검사를 확인합니다. 이전 검사와 비교할 수 있으면 변화와 뼈 상태를 함께 평가합니다.',
    steps:['주위 조직 검사','염증과 뼈 상태 평가','위생 관리 및 필요한 치료','치료 후 재평가','정기 유지관리'],
    sections:[{id:'symptoms',title:'“임플란트 주변에서 피가 나요”',text:'출혈·붓기·불편감이 있다면 잇몸 상태를 확인해야 합니다. 통증이 크지 않아도 염증이 있을 수 있으며 증상만으로 뼈 손실 여부를 알 수는 없습니다.'},{id:'options',title:'치료는 손상 범위에 따라 달라집니다',text:'청결 관리 방법을 점검하고 필요한 비수술적 처치를 검토합니다. 잔존 염증이나 뼈 손상 정도에 따라 외과적 치료 또는 임플란트 제거 필요성까지 평가할 수 있습니다.'}],
    care:'치간 관리 도구는 주변 공간과 보철물 형태에 맞춰 선택합니다. 치료 후에도 염증과 주위 조직의 변화를 주기적으로 확인합니다.',caution:'치료 후 재발하거나 추가 처치가 필요할 수 있습니다. 흡연, 치주질환 병력과 위생 상태 등을 함께 고려합니다.',related:['implant-maintenance','periodontal','implant-repair'],sourceKeys:['implant','gum'],
  },
  {
    slug:'implant-maintenance',title:'임플란트 유지관리',group:'임플란트',description:'식립 후에도 잇몸, 교합, 스크류와 보철물을 정기적으로 확인합니다.',
    definition:'임플란트와 보철물의 기능 및 주변 조직 상태를 지속적으로 점검하는 관리입니다.',examination:'임플란트 주위 조직 평가, 출혈·염증, 교합 확인, 스크류 상태 확인과 보철물 점검을 시행합니다. 필요에 따라 영상검사를 비교합니다.',
    steps:['정기검진','임플란트 주변 잇몸관리','교합·스크류·보철물 점검','주위 조직 평가','개인별 관리 계획 조정'],
    sections:[{id:'daily',title:'매일 하는 관리',text:'보철물 형태에 맞는 칫솔질과 치간 청소 방법을 안내받습니다. 작은 틈이나 보철물 아래처럼 닦기 어려운 곳도 확인합니다.'},{id:'visit',title:'검진 주기는 개인별로 정합니다',text:'잇몸 상태, 위생 관리 능력, 기존 염증과 부품 문제를 고려하여 검진 간격을 정합니다. 나사 풀림이나 출혈이 있다면 다음 정기검진까지 기다리지 말고 확인하세요.'}],
    care:'출혈, 냄새, 흔들림과 씹을 때 불편감의 변화를 기록하면 진료에 도움이 됩니다.',caution:'정기검진을 받더라도 모든 합병증을 예방할 수 있는 것은 아닙니다. 변화가 생기면 별도 평가가 필요합니다.',related:['peri-implantitis','implant-repair','periodontal'],sourceKeys:['implant'],
  },
  {
    slug:'cavity',title:'충치·치아보존',group:'충치·치아보존',description:'충치의 깊이와 남은 치질, 치수 상태를 확인하여 수복과 치수 보존 가능성을 검토합니다.',
    definition:'충치로 손상된 부분을 평가하고 남은 치아 조직을 가능한 범위에서 보존하면서 형태와 기능을 회복하는 치료입니다.',examination:'충치의 범위와 깊이, 치아 균열, 남아 있는 치질 및 치수의 반응을 확인합니다. 통증 양상과 필요한 방사선검사 등을 종합합니다.',
    steps:['충치 발견','범위·깊이 평가','남아 있는 치질 평가','치수 상태 평가','치아·치수 보존 가능성 검토','필요한 치료','최종 수복'],
    sections:[{id:'restoration',title:'레진 수복과 인레이·온레이',text:'손상 범위, 위치, 접착 조건과 씹는 힘에 따라 직접 레진 수복 또는 제작한 인레이·온레이 등을 검토합니다. 남은 치질을 보호하기 위한 수복 범위는 치아마다 다릅니다.'},{id:'deep',title:'깊은 충치치료',text:'치수와 가까운 충치는 치수의 상태를 함께 평가해야 합니다. 적응증에 따라 생활치수치료(VPT)를 검토하거나 근관치료가 필요할 수 있습니다.'},{id:'build-up',title:'치아가 많이 손상되었다면',text:'남은 치질과 치아의 보존 가능성을 확인하고 레진 빌드업, 부분 수복 또는 보철치료 등을 논의합니다. 손상량만으로 치료방법을 단정하지 않습니다.'}],
    care:'불소 치약으로 칫솔질하고 치아 사이도 관리합니다. 식습관과 충치 위험도를 함께 점검하고 수복물 경계를 정기적으로 확인합니다.',caution:'시림이나 통증이 지속되거나 악화되면 치수 상태 등을 재평가합니다. 깊은 충치는 치료 후에도 추가 처치가 필요할 수 있습니다.',related:['resin-build-up','vital-pulp-therapy','root-canal','prosthodontics'],sourceKeys:['decay','pulp'],
  },
  {
    slug:'resin-build-up',title:'레진 빌드업',group:'충치·치아보존',description:'많이 손상된 치아의 남은 조직을 평가하여 복합레진으로 형태를 회복하는 접근을 안내합니다.',
    definition:'충치나 파절 등으로 잃은 치아 조직을, 남아 있는 치아를 바탕으로 복합레진을 이용해 회복하는 치료입니다.',examination:'남은 치질의 양과 위치, 균열·파절 범위, 치수 상태, 방습과 접착 가능성 및 교합을 확인합니다.',
    steps:['손상된 치아 확인','남은 치질 평가','수복 가능성 검토','레진 빌드업','형태·교합 확인','최종 수복·경과 확인'],
    sections:[{id:'indications',title:'어떤 상황에서 검토하나요?',text:'손상 범위와 접착 조건에 따라 단독 수복 또는 보철치료 전 형태 회복으로 검토합니다.',items:['치아 조직이 많이 손상된 경우','치아 일부가 파절된 경우','기존 수복물이 탈락한 경우','치아 형태 회복이 필요한 경우','보철치료 전 형태 회복이 필요한 경우']},{id:'limits',title:'모든 치아에 가능한 것은 아닙니다',text:'깊은 파절, 치근 손상, 부족한 치질이나 방습이 어려운 상황 등에서는 다른 치료가 필요할 수 있습니다. 빌드업 이후 크라운·온레이 등 추가 수복을 검토하기도 합니다.'}],
    care:'과도하게 단단한 음식을 해당 치아로 깨무는 습관을 피하고 수복물 경계, 파절과 교합을 확인합니다.',caution:'탈락, 마모 또는 파절이 생길 수 있습니다. 치수 상태에 따라 VPT나 근관치료가 별도로 필요할 수 있습니다.',related:['cavity','vital-pulp-therapy','prosthodontics'],sourceKeys:['decay'],
  },
  {
    slug:'vital-pulp-therapy',title:'MTA를 이용한 생활치수치료·VPT',group:'충치·치아보존',description:'깊은 충치에서 치수 상태와 적응증을 평가하여 치수 보존을 검토하는 과정을 설명합니다.',
    definition:'생활치수치료(VPT, Vital Pulp Therapy)는 건강한 치수를 가능한 범위에서 보존하는 것을 목표로 합니다. 치수가 가깝거나 노출되었을 때에도 상태를 평가하여 적응증에 맞는 경우 검토합니다.',
    examination:'통증과 치수 반응, 염증·감염 상태, 출혈 양상, 남아 있는 치질, 방습과 밀폐 수복 가능성 등을 종합적으로 평가합니다.',
    steps:['충치 제거','치수 상태 확인','치수 보존 가능성 평가','필요한 범위의 치수 처치','MTA 등의 재료 적용','치아 수복','경과 관찰'],
    sections:[{id:'material',title:'MTA는 어떤 역할을 하나요?',text:'MTA(Mineral Trioxide Aggregate) 등 치수 처치에 사용하는 재료를 적절한 부위에 적용하고 수복합니다. 재료 선택만이 아니라 감염 관리와 수복물의 밀폐, 이후 경과 확인이 중요합니다.'},{id:'selection',title:'깊은 충치 모두에서 VPT가 가능하지는 않습니다',text:'치수와 치근 주변 상태, 출혈 조절과 치질 상태 등을 고려하여 처치 범위를 정합니다. 검사나 처치 중 소견에 따라 근관치료로 계획이 달라질 수 있습니다.'},{id:'follow-up',title:'치료 후에도 치수 상태를 확인합니다',text:'증상과 치수·치근 주변의 변화를 경과 관찰합니다. VPT 이후에도 상태에 따라 근관치료가 필요할 수 있습니다.'}],
    care:'안내받은 검진 일정에 따라 통증, 수복물과 필요한 영상검사 소견을 확인합니다.',caution:'치수 보존이나 장기적인 결과를 보장하는 치료는 아닙니다. 지속되는 자발통·붓기 등 변화가 있다면 재평가가 필요합니다.',related:['cavity','root-canal','resin-build-up'],sourceKeys:['pulp','root'],
  },
  {
    slug:'root-canal',title:'신경치료·근관치료',group:'충치·치아보존',description:'치수염, 치수괴사와 근관 감염을 평가하고 일반 근관치료 및 재근관치료를 검토합니다.',
    definition:'신경치료라고 부르는 근관치료는 치아 안의 치수와 근관 상태를 평가한 뒤, 필요한 경우 감염되거나 손상된 조직을 제거하고 근관을 세척·소독하여 충전하는 치료입니다.',examination:'통증, 치수 반응, 치근 주변 상태와 영상검사를 확인합니다. 균열과 남은 치질을 평가하여 치아를 보존하고 최종 수복할 수 있는지도 검토합니다.',
    steps:['치수·근관 상태 평가','치료 필요성 결정','근관 처치와 세척·소독','근관 충전','치아 최종 수복','경과 확인'],
    sections:[{id:'disease',title:'치수염·치수괴사·근관 감염',text:'치수에 염증이 있거나 생활력을 잃은 경우, 근관 감염이 있는 경우 등을 구분하여 판단합니다. 통증 유무만으로 치료 필요성을 결정하지 않습니다.'},{id:'retreatment',title:'기존 신경치료 치아도 평가합니다',text:'이전 근관치료 치아에 통증이나 치근 주변 병소가 있다면 수복물, 근관 상태, 균열 등을 확인합니다. 필요한 경우 재근관치료를 검토하고 난이도에 따라 의뢰를 논의할 수 있습니다.'}],
    care:'임시 수복 기간에는 치아 손상을 피하고 최종 수복을 완료합니다. 검진으로 수복물과 치근 주변의 경과를 확인합니다.',caution:'복잡한 근관, 재감염이나 균열 등의 이유로 추가 치료가 필요할 수 있습니다. 모든 치아를 근관치료로 보존할 수 있는 것은 아닙니다.',related:['vital-pulp-therapy','resin-build-up','prosthodontics'],sourceKeys:['root'],
  },
  {
    slug:'periodontal',title:'잇몸·치주치료',group:'잇몸·치주',description:'출혈, 붓기, 치아 흔들림과 잇몸 변화를 검사하여 필요한 처치와 유지관리를 계획합니다.',
    definition:'잇몸과 치아를 지지하는 조직의 상태를 검사하고 염증과 치석, 치주낭 등을 평가하여 치료하는 접근입니다.',examination:'치주낭 깊이, 출혈, 치석, 치아 동요도와 필요한 영상검사로 치조골 상태를 확인합니다. 위생 관리와 전신 건강도 함께 살핍니다.',
    steps:['잇몸 상태 검사','치석·염증 정도 평가','필요한 치주치료','치료 후 재평가','유지관리'],
    sections:[{id:'symptoms',title:'이런 변화를 느끼셨나요?',text:'출혈·붓기·잇몸 내려감·치아 흔들림의 원인은 검사를 통해 확인합니다.',items:['“양치할 때 피가 나요”','“잇몸이 붓고 아파요”','“잇몸이 내려간 것 같아요”','“치아가 흔들려요”','“치석이 많이 생겼어요”']},{id:'treatment',title:'스케일링과 치근면 처치',text:'치석과 치태를 제거하고 필요한 비수술적 치주치료를 검토합니다. 치주낭과 염증이 남아 있으면 재평가 후 외과적 치주치료 필요성을 평가할 수 있습니다.'},{id:'maintenance',title:'치료 후 재평가와 정기 관리',text:'잇몸 상태와 치주낭의 변화를 확인하고 관리 간격을 조정합니다. 임플란트가 있다면 주위 조직 관리도 함께 확인합니다.'}],
    care:'개인에게 맞는 칫솔질과 치간 청소를 지속합니다. 흡연과 전신질환 등 관리에 영향을 주는 요인도 확인합니다.',caution:'치료 후 시림이나 잇몸 형태 변화가 느껴질 수 있습니다. 치료만으로 이미 손상된 지지조직이 모두 회복되는 것은 아닙니다.',related:['scaling','peri-implantitis','implant-maintenance'],sourceKeys:['gum'],
  },
  {
    slug:'scaling',title:'스케일링',group:'잇몸·치주',description:'치석과 치태 제거 후 잇몸 상태를 확인하고 추가 치주치료 필요성을 평가합니다.',definition:'치아 표면과 잇몸 주변의 치석·치태를 제거하는 처치입니다.',examination:'치석이 쌓인 부위, 잇몸 출혈과 염증, 치주낭 및 시림을 확인합니다.',steps:['치아·잇몸 검사','치석·치태 제거','잇몸 상태 확인','추가 치료 필요성 평가','청결 관리'],
    sections:[{id:'limits',title:'스케일링만으로 충분한가요?',text:'깊은 치주낭이나 진행된 치주질환이 있다면 치근면 처치 등 추가 치료가 필요할 수 있습니다.'},{id:'interval',title:'관리 주기',text:'치석이 생기는 정도와 잇몸 상태, 위생 관리에 따라 점검과 처치 주기를 정합니다.'}],care:'시림이 있으면 관리 방법을 상담하고 치간 청소를 함께 시행합니다.',caution:'일시적인 시림이나 불편감이 생길 수 있습니다. 지속되는 출혈·통증은 재평가가 필요합니다.',related:['periodontal','implant-maintenance'],sourceKeys:['gum'],
  },
  {
    slug:'prosthodontics',title:'보철·심미수복',group:'보철·심미',description:'크라운, 브릿지, 인레이·온레이와 접착성 보철을 치질·교합 상태에 맞춰 검토합니다.',definition:'손상되거나 상실된 치아의 형태와 기능, 필요한 심미적 요소를 수복물로 회복하는 치료입니다.',examination:'남은 치질, 치수·잇몸 상태, 결손 부위와 인접 치아, 교합 및 접착 조건을 평가합니다.',steps:['치아·교합 검사','치질 보존과 수복 범위 계획','필요한 전처치','수복물 제작·적합 확인','장착·접착','경과 점검'],
    sections:[{id:'types',title:'수복 범위에 따라 방법을 선택합니다',text:'크라운은 치아를 덮어 회복하고 인레이·온레이는 손상 범위에 맞춰 일부를 회복합니다. 일반 브릿지는 결손 부위의 인공 치아를 인접 지지 치아와 연결합니다. 삭제량과 남은 치아 보호를 함께 고려합니다.'},{id:'adhesive',title:'접착성 보철과 심미수복',text:'라미네이트와 메릴랜드 브릿지 등은 치아·수복물의 접착 조건을 평가합니다. 무삭제·최소삭제 접근이 적절한지는 치아 형태와 배열, 교합 등에 따라 달라집니다.'},{id:'zirconia',title:'지르코니아 보철',text:'지르코니아는 보철물 재료 중 하나입니다. 크라운·브릿지와 적응증에 따른 라미네이트, 인레이·온레이 등에 검토할 수 있습니다. 보철물 종류, 두께, 표면처리와 접착 시스템을 함께 계획합니다.'}],
    care:'수복물 경계와 브릿지 아래의 위생을 관리하고 교합·탈락·파절 여부를 정기적으로 확인합니다.',caution:'시림, 탈락과 파절 또는 추가 치수 처치가 필요할 수 있습니다. 재료나 치료방법의 우열을 모든 상황에 일반화할 수는 없습니다.',related:['laminate','maryland-bridge','stm','resin-build-up'],sourceKeys:['bridge','veneer'],
  },
  {
    slug:'laminate',title:'라미네이트·무삭제·최소삭제',group:'보철·심미',description:'치아의 형태와 색상, 배열 및 교합을 평가하여 얇은 수복물을 접착하는 치료를 검토합니다.',definition:'치아 표면에 얇은 수복물을 접착하여 색상, 형태와 크기 등을 개선하는 심미수복 방법입니다.',examination:'배열과 돌출 정도, 필요한 색상 변화, 치아 표면과 남은 법랑질, 수복물 두께 및 교합을 확인합니다.',steps:['치아 형태·색상·교합 평가','치료 선택지 비교','삭제 필요량 검토','수복물 제작','적합·접착','관리와 경과 확인'],
    sections:[{id:'minimal',title:'무삭제·최소삭제가 가능한 조건',text:'치아 형태와 배열, 돌출, 색상 변화와 필요한 두께를 평가하여 적응증에 맞으면 삭제하지 않거나 삭제량을 최소화하는 접근을 검토합니다. 모든 환자에게 무삭제가 가능한 것은 아닙니다.'},{id:'alternatives',title:'다른 방법과 함께 검토합니다',text:'치아 위치 이동이 필요한 경우 교정, 변색이 주된 문제인 경우 미백, 작은 형태 손상은 레진 수복 등의 선택지를 함께 논의할 수 있습니다.'},{id:'zirconia',title:'지르코니아 라미네이트와 접착',text:'재료와 두께, 치아 측 접착 조건 및 보철물 접착면의 준비를 함께 검토합니다. STM 등의 표면처리는 접착 과정의 한 요소이며 치료 결과를 보장하지 않습니다.'}],
    care:'앞니로 단단한 물체를 깨물지 않고 수복물 경계와 교합을 확인합니다. 이갈이·이악물기가 있다면 관리 방법을 상담합니다.',caution:'치아 삭제가 이루어지면 되돌릴 수 없습니다. 탈락·파절·색상 차이와 시림 등의 가능성을 고려합니다.',related:['stm','diastema','whitening','partial-orthodontics'],sourceKeys:['veneer'],
  },
  {
    slug:'maryland-bridge',title:'메릴랜드 브릿지',group:'보철·심미',description:'Maryland bridge / resin-bonded bridge의 접착 구조와 다른 결손 치아 회복 방법을 비교합니다.',definition:'상실된 치아를 회복하는 방법 중 하나로, 인접 치아에 접착하는 날개 등의 구조를 이용하여 결손 부위의 인공 치아를 지지하는 접착성 브릿지입니다.',examination:'결손 부위, 인접 치아의 법랑질·수복물과 치주 상태, 교합, 접착면 확보와 위생 관리 가능성을 평가합니다.',steps:['결손 부위·인접 치아 검사','치료 선택지 비교','지지·접착 구조 계획','수복물 제작','접착과 교합 확인','유지관리'],
    sections:[{id:'comparison',title:'일반 브릿지와 구조가 다릅니다',text:'일반 브릿지는 인접 지지 치아를 덮는 크라운 형태와 인공 치아를 연결합니다. 메릴랜드 브릿지는 인접 치아의 주로 안쪽 면에 접착하는 구조를 이용합니다. 지지 치아 수와 날개 형태는 증례에 따라 달라집니다.'},{id:'choice',title:'임플란트·일반 브릿지와 함께 비교합니다',text:'인접 치아 상태, 뼈와 잇몸, 교합과 수술 가능 여부에 따라 선택이 달라집니다. 어느 방법이 모든 환자에게 우월하다고 일반화하지 않습니다.'},{id:'bonding',title:'접착면의 준비',text:'재료에 맞는 표면처리와 접착 시스템을 계획합니다. 지르코니아를 사용하는 경우 STM 적용 가능성 등도 재료 조건에 따라 검토합니다.'}],
    care:'인공 치아 아래와 접착 지지 부위를 청결하게 관리합니다. 들뜸이나 탈락이 느껴지면 사용을 멈추고 확인합니다.',caution:'접착 탈락이나 파절이 생길 수 있으며 재부착이 가능한지는 치아와 수복물 상태를 확인해야 합니다.',related:['implant','prosthodontics','stm'],diagram:'bridge',sourceKeys:['bridge'],
  },
  {
    slug:'stm',title:'STM 표면처리',group:'보철·심미',description:'Surface Transition Machine을 이용한 지르코니아 접착면 준비와 근거의 한계를 설명합니다.',definition:'이 페이지에서 STM은 Surface Transition Machine을 뜻합니다. 지르코니아 등 적용 가능한 보철물의 접착면을 처리하여 접착에 필요한 표면 특성을 조절하는 기술이라는 관점에서 설명합니다.',examination:'수복물 재료와 제작 단계, 적용 가능한 표면처리 방식, 치아 측 접착 조건 및 접착 시스템의 적합성을 확인합니다.',steps:['지르코니아 보철물','STM 표면처리','미세 표면구조 변화','접착을 위한 표면 준비','적절한 접착 시스템을 이용한 보철물 접착'],
    sections:[{id:'role',title:'접착 과정의 한 요소입니다',text:'표면 특성의 조절은 접착면 준비의 일부입니다. 치아 측 준비, 방습, 프라이머·시멘트와 보철물 형태 등도 함께 고려합니다.'},{id:'applications',title:'연결되는 치료',text:'지르코니아 라미네이트, 무삭제·최소삭제 라미네이트, 메릴랜드 브릿지, 지르코니아 인레이·온레이 등 접착성 보철과 연결하여 검토할 수 있습니다. 모든 재료와 보철물에 같은 처리를 적용하지는 않습니다.'},{id:'evidence',title:'실험실 결과와 실제 치료결과는 다릅니다',text:'공개된 STM 표면처리 연구에는 지르코니아 시편을 이용한 실험실 평가가 있습니다. 이러한 접착강도 결과를 환자의 장기 임상결과로 그대로 해석할 수는 없습니다. 특정 수치나 제조사 홍보문구로 치료 결과를 보장하지 않습니다.'}],
    care:'접착 이후에도 수복물 경계와 교합, 탈락·파절 등을 정기적으로 확인합니다.',caution:'장비와 표면처리만으로 장기 접착이나 수복물 유지가 보장되는 것은 아닙니다. 실제 적용 범위와 방법은 재료 및 의료진 평가에 따라 확인합니다.',related:['laminate','maryland-bridge','zirconia-inlay-onlay','prosthodontics'],sourceKeys:['stm'],
  },
  {
    slug:'whitening',title:'치아미백',group:'보철·심미',description:'변색 원인, 충치·잇몸과 기존 수복물을 확인한 뒤 미백 가능성과 관리 방법을 안내합니다.',definition:'자연치의 색상 변화를 목적으로 하는 치료로, 변색의 원인과 구강 상태에 따라 방법과 반응이 달라집니다.',examination:'치아 변색 원인, 충치·잇몸 상태, 시림 여부와 기존 레진·크라운·라미네이트를 확인합니다.',steps:['변색 원인 평가','충치·잇몸 확인','기존 수복물 확인','시림 여부 확인','치아미백','미백 후 관리'],
    sections:[{id:'restorations',title:'기존 보철물은 자연치와 다릅니다',text:'크라운·라미네이트·레진 등은 자연치와 미백 반응이 다를 수 있습니다. 미백 후 색상 차이가 생길 수 있어 수복물 상태와 필요성을 함께 논의합니다.'},{id:'variation',title:'변화와 유지기간은 개인마다 다릅니다',text:'변색 원인, 치아 상태와 생활습관에 따라 반응과 유지기간이 달라집니다. 기대하는 색상과 치료 범위를 진료에서 확인합니다.'}],
    care:'안내받은 사용 방법과 관리 지침을 따르고 색상 변화 및 시림을 확인합니다.',caution:'일시적인 시림이나 잇몸 자극이 생길 수 있습니다. 효과와 유지기간을 획일적으로 보장할 수 없습니다.',related:['laminate','prosthodontics','cavity'],sourceKeys:['whitening'],
  },
  {
    slug:'wisdom-teeth',title:'사랑니·발치',group:'사랑니·턱관절',description:'사랑니 위치와 주변 치아·신경관 등을 확인하여 발치 필요성과 난이도를 평가합니다.',definition:'사랑니의 맹출 상태, 충치와 염증 및 주변 구조를 확인하여 관찰 또는 발치 필요성을 판단합니다.',examination:'일반 사랑니, 부분 맹출 사랑니와 매복 사랑니를 구분하고 주변 염증·충치, 인접 치아와의 관계를 확인합니다. 필요한 경우 신경관 등 주변 구조를 영상으로 평가합니다.',steps:['검사','사랑니 위치 확인','발치 필요성 평가','난이도·주변 구조 확인','필요한 경우 발치','발치 후 관리'],
    sections:[{id:'selection',title:'모든 사랑니를 발치해야 하나요?',text:'청결 관리가 가능하고 문제가 없는 사랑니는 상태를 확인하며 관찰할 수 있습니다. 반복되는 염증이나 충치, 주변 치아에 대한 영향 등을 평가하여 결정합니다.'},{id:'referral',title:'난이도에 따라 의뢰가 필요할 수 있습니다',text:'본원 진료범위를 넘어서는 고난도 증례는 필요한 경우 적절한 의료기관으로 의뢰할 수 있습니다.'}],
    care:'발치 후 안내받은 지혈·식사·위생 지침을 따릅니다. 회복 경과에 맞춰 발치 부위를 확인합니다.',caution:'출혈, 붓기, 감염이나 감각 변화가 생길 수 있습니다. 심한 통증이나 출혈이 지속되면 의료진에게 확인합니다.',related:['periodontal','cavity','implant'],sourceKeys:['wisdom'],
  },
  {
    slug:'temporomandibular-disorders',title:'턱관절장애·TMD',group:'사랑니·턱관절',description:'턱 통증, 소리와 입 벌림 제한을 검사하여 턱관절 및 저작근 상태를 평가합니다.',definition:'턱관절장애(TMD, Temporomandibular Disorders)는 턱관절과 저작근 등에 관련된 여러 상태를 포함합니다. 관절음만으로 질환이나 치료 필요성을 단정하지 않습니다.',examination:'턱관절 통증, 개구 범위, 턱 움직임, 관절음, 저작근 통증·긴장, 이갈이·이악물기 관련 소견과 치아·교합 상태를 확인합니다. 필요한 경우 영상검사를 검토합니다.',steps:['증상·습관 확인','관절·저작근 검사','필요한 추가 평가','보존적 관리 계획','경과 재평가'],
    sections:[{id:'symptoms',title:'이런 증상을 확인합니다',text:'불편한 위치와 시작 시기, 움직임에 따른 변화를 확인합니다.',items:['“입을 벌릴 때 턱이 아파요”','“턱에서 소리가 나요”','“입이 잘 안 벌어져요”','“씹을 때 턱이 불편해요”','“아침에 턱이나 얼굴 근육이 뻐근해요”','“이를 악무는 습관이 있는 것 같아요”']},{id:'management',title:'진단에 따른 보존적 접근',text:'일반적인 선택지로 생활습관 조절과 보존적 관리, 약물치료, 물리치료 또는 교합안정장치(스플린트) 등을 검토할 수 있습니다. 본원에서 실제 시행하는 범위는 진료 시 확인하며, 필요한 경우 관련 의료기관으로 의뢰합니다.'}],
    care:'턱에 부담을 주는 습관을 확인하고 안내받은 범위에서 식사와 생활습관을 조정합니다. 임의로 턱을 강하게 교정하거나 무리하게 벌리지 않습니다.',caution:'원인에 따라 경과와 치료가 다릅니다. 치아나 교합을 영구적으로 바꾸는 치료는 필요성과 대안을 신중하게 평가해야 합니다.',related:['prosthodontics','partial-orthodontics'],diagram:'tmj',sourceKeys:['tmj'],
  },
  {
    slug:'partial-orthodontics',title:'부분교정',group:'교정·치아 사이 벌어짐',description:'일부 치아의 배열·공간·기울어짐을 개선할 수 있는지 전체 교합과 함께 평가합니다.',definition:'전체 치열이 아니라 특정 부위 또는 일부 치아의 위치와 배열 개선을 목표로 하는 교정치료입니다. 치료 범위에 관한 개념입니다.',examination:'치열 전체의 교합과 골격적 관계, 잇몸·치조골, 이동 공간과 필요한 치아 이동량을 확인합니다.',steps:['전체 교합·치주 상태 평가','제한적 이동 가능성 검토','범위·장치 계획','단계적 치아 이동','교합 확인','유지관리'],
    sections:[{id:'scope',title:'검토할 수 있는 상황',text:'전체 상태를 평가한 후 제한적인 이동으로 목표를 달성할 수 있는지 판단합니다.',items:['앞니 일부 배열 개선','특정 치아 사이 공간','일부 치아의 기울어짐','제한적인 치아 이동','필요한 경우 보철치료 전 치아 위치 조정']},{id:'limits',title:'전체 교합 문제도 확인해야 합니다',text:'전체적인 교합 문제나 골격적인 문제가 있으면 부분교정이 적절하지 않을 수 있습니다. 전체 교정 또는 다른 치료가 필요할 수 있습니다.'},{id:'aligners',title:'부분교정과 투명교정의 차이',text:'부분교정은 치료 범위, 투명교정은 장치에 따른 방법입니다. 부분교정에 어떤 장치를 사용할지는 이동 목표와 적응증에 따라 결정합니다.'}],
    care:'치아와 장치 주변을 청결하게 관리하고 치료 후 유지장치 사용과 검진 지침을 따릅니다.',caution:'재발, 잇몸 상태 변화와 치근 변화 등이 생길 수 있습니다. 치료 범위와 기간은 검사 후 확인합니다.',related:['clear-aligners','diastema','prosthodontics'],sourceKeys:['ortho'],
  },
  {
    slug:'clear-aligners',title:'투명교정',group:'교정·치아 사이 벌어짐',description:'Clear Aligner Therapy의 단계적 치아 이동과 적응증, 장치 착용 및 유지관리를 설명합니다.',definition:'투명교정(Clear Aligner Therapy)은 개인의 치아 상태에 맞춰 제작한 투명 장치를 단계적으로 사용하여 치아를 이동시키는 교정 방법 중 하나입니다.',examination:'전체 치열, 교합과 치주 상태, 필요한 이동의 종류·범위 및 장치를 지침에 맞게 착용할 수 있는지를 평가합니다.',steps:['치아·교합 검사','이동 계획','장치 제작','단계별 착용·점검','필요한 계획 조정','유지관리'],
    sections:[{id:'method',title:'투명교정은 장치에 관한 개념입니다',text:'치료 범위가 부분인지 전체인지와 장치 종류는 별개입니다. 투명 장치가 모든 치아 이동이나 교합 문제에 적합한 것은 아닙니다.'},{id:'wear',title:'착용과 점검이 중요합니다',text:'의료진이 정한 착용·교체 지침을 따르고 이동과 장치 적합 상태를 점검합니다. 상황에 따라 부가적인 처치나 추가 장치가 필요할 수 있습니다.'}],
    care:'장치와 치아를 청결하게 관리하고 치료 후 유지장치를 지침에 따라 사용합니다.',caution:'이동 반응, 착용 상태와 교합에 따라 기간이나 계획이 달라집니다. 원하는 결과를 장치 종류만으로 보장할 수 없습니다.',related:['partial-orthodontics','diastema','periodontal'],sourceKeys:['ortho'],
  },
  {
    slug:'diastema',title:'치아 사이 벌어짐·Diastema',group:'교정·치아 사이 벌어짐',description:'치간이개의 원인과 현재 상태를 평가하고 교정·레진·심미수복 등의 선택지를 비교합니다.',definition:'치아 사이 벌어짐(Diastema, 치간이개)은 치아 사이에 공간이 있는 상태를 뜻합니다. 치아 크기와 위치, 잇몸 상태 등 원인에 따라 접근이 달라집니다.',examination:'공간의 위치와 크기, 치아 형태·배열, 교합 및 잇몸·지지조직 상태를 확인합니다. 최근 공간이 커졌다면 그 원인도 평가합니다.',steps:['치아 사이 벌어짐 확인','원인·현재 상태 평가','위치 이동 또는 형태 회복 검토','치료 선택지 비교','선택한 치료','교합·유지관리 확인'],
    sections:[{id:'movement',title:'치아 위치 이동이 필요한 경우',text:'부분교정 또는 투명교정 등으로 이동이 적절한지 검토합니다. 전체 교합 상태에 따라 더 넓은 범위의 교정이 필요할 수 있습니다.'},{id:'resin',title:'치아 형태 회복이 적절한 경우',text:'레진을 이용한 공간 폐쇄를 검토할 수 있습니다. 치아의 폭과 형태, 접착 조건 및 교합을 고려합니다.'},{id:'aesthetic',title:'형태·색상 변화가 함께 필요한 경우',text:'라미네이트 등 심미수복을 검토할 수 있습니다. 삭제 필요량과 다른 방법의 장단점을 함께 비교합니다.'},{id:'choice',title:'한 가지 방법을 모두에게 권하지 않습니다',text:'원인과 치주 상태를 먼저 확인하고 치아 이동과 형태 회복의 필요성을 구분합니다. 필요한 경우 치료를 조합하거나 먼저 잇몸 치료를 시행할 수 있습니다.'}],
    care:'선택한 방법에 따라 유지장치, 수복물 경계와 교합을 관리하고 공간의 재변화를 확인합니다.',caution:'교정 후 공간 재발이나 수복물 탈락·파절 등이 생길 수 있습니다. 치료 전 원인과 관리 조건을 확인합니다.',related:['partial-orthodontics','clear-aligners','laminate','cavity','periodontal'],sourceKeys:['ortho','veneer'],
  },
];
export const treatmentGroups = ['임플란트','충치·치아보존','잇몸·치주','보철·심미','사랑니·턱관절','교정·치아 사이 벌어짐'];
export const symptoms = [
  {label:'임플란트가 흔들려요',targets:['implant-repair']},
  {label:'임플란트 나사가 풀렸어요',targets:['implant-repair#loosening']},
  {label:'임플란트 주변에서 피가 나요',targets:['peri-implantitis']},
  {label:'충치가 깊다고 들었어요',targets:['cavity#deep','vital-pulp-therapy','root-canal']},
  {label:'치아가 많이 깨졌어요',targets:['resin-build-up','prosthodontics']},
  {label:'앞니 하나가 없어요',targets:['implant','maryland-bridge','prosthodontics']},
  {label:'앞니 사이가 벌어졌어요',targets:['diastema','partial-orthodontics','clear-aligners','cavity#restoration','laminate']},
  {label:'치아 색이 고민이에요',targets:['whitening','laminate']},
  {label:'사랑니가 아파요',targets:['wisdom-teeth']},
  {label:'입을 벌릴 때 턱이 아파요',targets:['temporomandibular-disorders']},
  {label:'양치할 때 피가 나요',targets:['periodontal','scaling']},
];
export const treatmentHref = (slug:string) => { const [page,hash]=slug.split('#'); return `/treatments/${page}/${hash?`#${hash}`:''}`; };
