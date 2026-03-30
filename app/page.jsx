'use client';
import { useState } from 'react';

export default function Home() {
  const [patientName, setPatientName] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '요청 중 오류가 발생했습니다.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isAcute = result?.period?.includes('급성') && !result?.period?.includes('아급성');
  const isSubacute = result?.period?.includes('아급성');
  const isChronic = result?.period?.includes('만성');

  const commentHtml = result?.comment?.replace(
    /\*\*(.*?)\*\*/g,
    '<span style="font-size:22px; font-weight:900; color:#c0392b; background-color:#f9ebea; padding: 0 4px; border-radius: 3px;">$1</span>'
  );

  return (
    <div className="container" style={{maxWidth: '850px', margin: '40px auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)'}}>
      
      {/* -------------------- UI 영역 (인쇄 시 숨김) -------------------- */}
      <div className="no-print">
        <h1 style={{textAlign: 'center', color: '#5B4F4A', marginBottom: '10px', fontSize: '32px', fontWeight: '900'}}>🚀 한의원 전용 내원안내문 (공개 버전)</h1>
        <div style={{textAlign: 'center', color: '#777', marginBottom: '30px', background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
          ✨ 이 사이트는 완전히 오픈되어 있습니다.<br/>
          원장님의 API 서버가 안전하게 탑재되어 있어 <strong>누구나 로그인과 설정 없이 즉시 이용 가능합니다!</strong>
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>👤 환자 성함</label>
          <input 
            type="text" 
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)} 
            placeholder="환자 성함을 입력해주세요."
            style={{width:'100%', padding:'14px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'16px'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>📝 EMR 차트 텍스트 복사 및 붙여넣기</label>
          <textarea 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder="음성문진 차트의 대화록이나 분석 내용을 여기에 마우스로 붙여넣어주세요 (Ctrl+V)."
            rows={5}
            style={{width:'100%', padding:'14px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'16px', resize:'vertical'}}
          />
        </div>

        {error && <div style={{padding:'15px', background:'#ffebee', color:'#c62828', borderRadius:'8px', marginBottom:'20px'}}>{error}</div>}

        <button 
          onClick={handleGenerate} 
          disabled={loading || !inputText.trim()}
          style={{
            width: '100%', padding: '16px', borderRadius: '8px', border: 'none',
            background: loading ? '#ccc' : '#8a6d3b', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.3s'
          }}
        >
          {loading ? 'AI가 텍스트를 분석 중입니다 (약 3~5초 소요)...' : '✨ 위 텍스트로 내원안내문 즉시 생성하기'}
        </button>
        
        <hr style={{margin: '40px 0', border: 'none', borderTop: '2px dashed #eee'}} />
      </div>

      {/* -------------------- 인쇄 전용 영역 -------------------- */}
      {result && (
        <div className="print-area">
          <div className="no-print" style={{textAlign:'right', marginBottom:'20px'}}>
            <button onClick={handlePrint} style={{padding: '12px 24px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize:'18px', fontWeight:'bold'}}>
              🖨️ 인쇄하기 (A4 출력)
            </button>
          </div>

          <div className="letter-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#8a6d3b', marginBottom: '2px' }}>
                  장위365경희한의원
              </div>
              <div style={{ fontSize: '9px', color: '#999', letterSpacing: '1.5px', marginBottom: '8px' }}>JANGWI KYUNG HEE KOREAN MEDICINE CLINIC</div>
              <div style={{ display: 'flex', height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ flex: '20', backgroundColor: '#d6cfb3' }}></div>
                  <div style={{ flex: '15', backgroundColor: '#aeddd8' }}></div>
                  <div style={{ flex: '15', backgroundColor: '#fcf1d5' }}></div>
                  <div style={{ flex: '20', backgroundColor: '#fa7e7b' }}></div>
                  <div style={{ flex: '30', backgroundColor: '#63503b' }}></div>
              </div>
              
              <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '40px 0 20px 0', color: '#5B4F4A' }}>장위 <span style={{color:'#8a6d3b'}}>365</span>경희한의원 내원안내문</h1>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#777', marginTop: '5px' }}>만성질환은 <span style={{fontSize:'24px', fontWeight:'900', color:'#5b4834'}}>4</span>주간, 급성질환은 <span style={{fontSize:'24px', fontWeight:'900', color:'#5b4834'}}>2</span>주간 매일 치료 해주세요</p>
            </div>
          
            <div style={{ textAlign: 'right', fontSize: '26px', fontWeight: 'bold', marginTop: '60px', marginBottom: '30px' }}>
                <span style={{ borderBottom: '2px solid black', display: 'inline-block', minWidth: '250px', textAlign: 'center' }}>{patientName || '　　　　'}</span> 님
            </div>
            
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#5b4f4a' }}>
                💡 원장님의 당부 말씀 : 
            </div>
            <div 
              style={{ minHeight: '80px', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.6', padding: '20px', color: '#333', backgroundColor: '#f9fafb', borderRadius: '12px', borderLeft: '5px solid #8a6d3b' }}
              dangerouslySetInnerHTML={{ __html: commentHtml }}
            />
            
            <div style={{display: 'flex', marginTop: '35px', justifyContent: 'space-between', gap: '15px', fontWeight: 'bold', fontSize: '20px'}}>
              <div style={{flex: 1, padding: '18px', textAlign: 'center', borderRadius: '12px', border: isAcute ? '2px solid #8a6d3b' : '1px solid #eaeaea', background: isAcute ? '#fff4d2' : '#fff', color: isAcute ? '#5b4834' : '#bbb'}}>
                {isAcute ? '☑' : '☐'} 급성기
              </div>
              <div style={{flex: 1, padding: '18px', textAlign: 'center', borderRadius: '12px', border: isSubacute ? '2px solid #8a6d3b' : '1px solid #eaeaea', background: isSubacute ? '#fff4d2' : '#fff', color: isSubacute ? '#5b4834' : '#bbb'}}>
                {isSubacute ? '☑' : '☐'} 아급성기
              </div>
              <div style={{flex: 1, padding: '18px', textAlign: 'center', borderRadius: '12px', border: isChronic ? '2px solid #8a6d3b' : '1px solid #eaeaea', background: isChronic ? '#fff4d2' : '#fff', color: isChronic ? '#5b4834' : '#bbb'}}>
                {isChronic ? '☑' : '☐'} 만성기
              </div>
            </div>

            <div style={{ marginTop: '25px', padding: '35px 25px', borderRadius: '12px', fontSize: '18px', lineHeight: '2.8', fontWeight: 'bold', color: '#666', border: '1px solid #eaeaea', background: '#fafafa', position: 'relative' }}>
              <div style={{position: 'absolute', top: '-16px', left: '25px', background: '#5b4834', color: 'white', padding: '5px 20px', borderRadius: '20px', fontSize: '16px'}}>치료 계획 안내</div>
              
              <span style={{color:'#8a6d3b'}}>▶</span> 치료기간 : ( 주 <span style={{borderBottom: '1px solid black', padding: '0 10px', display: 'inline-block', minWidth: '40px', textAlign: 'center', color:'#333'}}>{result?.frequency?.replace(/[^0-9~]/g, '') || ''}</span>회 내원 )  
              <span style={{marginLeft: '30px', color:'#8a6d3b'}}>▶</span> 치료방법 : <span style={{color:'#333', marginLeft: '5px'}}>
                {['침', '물리치료', '약침치료', '추나치료', '탕약치료'].map((m) => {
                  const match = result?.methods?.some(x => x.includes(m) || m.includes(x));
                  return match 
                    ? <span key={m} style={{fontSize:'20px', fontWeight:'900', color:'#111', backgroundColor:'#ffeb3b', borderRadius:'4px', padding:'2px 8px', marginRight:'6px'}}>{m}</span>
                    : <span key={m} style={{color:'#aaa', marginRight:'8px', fontWeight:'normal'}}>{m}</span>
                })}
              </span>
              <br/>
              <span style={{color:'#8a6d3b'}}>▶</span> 주의사항 : 증상을 유발, 악화 하는 무리한 활동을 피하고 안정을 취하셔야 합니다.
              <br/>
              <div style={{color: '#b56230', textAlign: 'center', marginTop: '35px', marginBottom: '10px', fontSize: '20px', background: '#fdf2e9', padding: '15px', borderRadius: '8px'}}>
                  초기에 증상이 심하신 경우 최소 <span style={{fontSize:'24px', fontWeight:'900'}}>2</span>주 동안은 매일 내원 하시는 것이 좋습니다.
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '70px', fontSize: '13px', color: '#aaa', letterSpacing: '1px', fontWeight: 'bold' }}>
                365일 진료 · 평일 매일 야간진료 · 주말 공휴일 진료
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
