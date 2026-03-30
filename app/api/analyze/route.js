import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    // Server-side API KEY (안전한 보관)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "서버에 API 키 설정이 누락되어 있습니다 (배포 후 규칙 확인 바람)." }), { status: 500, headers: {'Content-Type': 'application/json'} });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
당신은 한의원 진료 상담 내용을 듣고 핵심만 요약하는 한의원 실장입니다.
제공된 아래의 진료 대화록 또는 EMR 차트 텍스트를 철저하게 분석하여 '내원안내문' 작성에 필요한 다음 5가지 속성(시기, 기간, 빈도, 치료방법, 코멘트)을 **절대 누락시키지 말고 반드시 추출**하세요.
출력은 **반드시 JSON 형식**으로만 반환해야 합니다. 다른 문장은 덧붙이지 마세요.

[분석할 텍스트]:
${text}

[JSON 출력 단일 객체 양식 (키 이름 반드시 영문으로 고정, 값은 반드시 한글로 기재, 속성 빈값 금지)]:
{
    "transcript": "(입력된 텍스트 원본을 기반으로 상담 내용을 보기 좋게 정리해서 기록)",
    "period": "(텍스트 중 '급성'이라는 언급이 있으면 무조건 '급성기', 만성이면 '만성기' 등으로 기재. 없으면 맥락상 유추하여 적으세요)",
    "duration": "(예: 4, 1~2 등. 숫자나 '~' 기호 위주로 기재. '2주에서 3주'는 '2~3' 등으로 변환 추출)",
    "frequency": "(예: 매일, 1~2 등. 빈도를 추출. '주 3에서 4'는 '3~4' 등으로 변환 추출)",
    "methods": ["침", "약침", "추나", "한약", "물리치료" 중 텍스트에 등장하는 치료 방식 모두를 배열로 나열. 없으면 빈 배열이 아니라 유추해서라도 넣으세요.],
    "comment": "(대화에서 유추한 환자의 명확한 진단명(예: 디스크, 협착증, 근육통, 염좌 등)을 반드시 **진단명** 처럼 앞뒤에 별표 두 개를 붙여 강조하고, 이어서 작성하는 당부/주의사항 1문장)"
}
`;
    
    const result = await model.generateContent(prompt);
    let outputText = await result.response.text();
    outputText = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(outputText);
    
    return new Response(JSON.stringify(data), { status: 200, headers: {'Content-Type': 'application/json'} });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: {'Content-Type': 'application/json'} });
  }
}
