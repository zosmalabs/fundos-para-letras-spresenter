import { useEffect, useState } from 'react';
import { onMessage, postMessage } from '@spresenter/plugin-sdk/ui';
import { Alert, Button, Checkbox, Field, Header, Panel, Root, Row, Select, Stack, StatusIndicator } from '@spresenter/plugin-sdk/ui-kit/react';
interface Config {enabled:boolean;output:string;layer:number|null;elementId:string;preset:string;mode:string;color:string;opacity:number;paddingX:number;paddingY:number;lineGap:number;radius:number;borderEnabled:boolean;borderColor:string;borderOpacity:number;borderWidth:number;stripeWidth:number}
interface State {type:'state';config:Config;outputs:{index:number;name:string}[];layers:{index:number;name?:string}[];target:null|{title:string;theme:string;candidates:{id:string;marker:string}[]};status:string}
interface SaveResult {type:'save-result';ok:boolean;message?:string}
const initial:Config={enabled:true,output:'0',layer:null,elementId:'',preset:'black-soft',mode:'box',color:'#000000',opacity:.55,paddingX:24,paddingY:12,lineGap:0,radius:10,borderEnabled:false,borderColor:'#ffffff',borderOpacity:.5,borderWidth:1,stripeWidth:90};
function Range(p:{label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void}){
  const shown=(p.step||1)<1?Math.round(p.value*100)+'%':String(p.value);
  return <Field label={p.label+': '+shown}><input className="range" type="range" min={p.min} max={p.max} step={p.step||1} value={p.value} onChange={e=>p.onChange(Number(e.target.value))}/></Field>;
}
export function App(){
  const [state,setState]=useState<State>({type:'state',config:initial,outputs:[],layers:[],target:null,status:'Iniciando'});
  const [saveFeedback,setSaveFeedback]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const [saveError,setSaveError]=useState('');
  useEffect(()=>{const off=onMessage(raw=>{const m=raw as State|SaveResult;
    if(m?.type==='state')setState(m);else if(m?.type==='save-result'){setSaveFeedback(m.ok?'saved':'error');setSaveError(m.ok?'':m.message||'Não foi possível salvar.')}
  });postMessage({type:'init'});return off},[]);
  useEffect(()=>{if(saveFeedback!=='saved'&&saveFeedback!=='error')return;const timer=window.setTimeout(()=>setSaveFeedback('idle'),4000);return()=>window.clearTimeout(timer)},[saveFeedback]);
  const set=(patch:Partial<Config>)=>{setSaveFeedback('idle');postMessage({type:'config',config:{...state.config,...patch,preset:'custom'}})};
  const choosePreset=(preset:string)=>{setSaveFeedback('idle');postMessage({type:'preset',preset})};
  const save=()=>{setSaveFeedback('saving');setSaveError('');postMessage({type:'save'})};
  const c=state.config;
  const alpha=Math.round(c.opacity*255).toString(16).padStart(2,'0');
  return <Root>
    <Header title="Fundo por Linha" subtitle="Uma caixa independente para cada quebra da letra."/>
    <StatusIndicator state={state.status.includes('Falha')||state.status.includes('Erro')?'error':state.status.includes('Nenhum')?'warn':c.enabled?'ok':'idle'} label={state.status} detail={state.target?state.target.title+' · '+state.target.theme:undefined}/>
    <Button block variant={c.enabled?'danger':'primary'} onClick={()=>set({enabled:!c.enabled})}>{c.enabled?'Desativar fundo':'Ativar fundo'}</Button>
    <Panel label="Predefinição"><Select value={c.preset} onChange={e=>choosePreset(e.target.value)}>
      <option value="black-soft">Preto discreto</option><option value="black-strong">Preto forte</option><option value="white-soft">Branco translúcido</option><option value="broadcast">Transmissão</option><option value="custom">Personalizado</option>
    </Select></Panel>
    <Panel label="Cor e opacidade"><Row><input className="color" type="color" value={c.color} onChange={e=>set({color:e.target.value})}/><Range label="Opacidade" value={c.opacity} min={0} max={1} step={.01} onChange={opacity=>set({opacity})}/></Row>
      <div className="preview" style={{lineHeight:'calc(1.8em + '+c.lineGap+'px)'}}><div><span style={{backgroundColor:c.color+alpha,padding:c.paddingY+'px '+c.paddingX+'px',borderRadius:c.radius,border:c.borderEnabled?c.borderWidth+'px solid '+c.borderColor:'none'}}>UMA CHUVA DIFERENTE</span></div><div><span style={{backgroundColor:c.color+alpha,padding:c.paddingY+'px '+c.paddingX+'px',borderRadius:c.radius,border:c.borderEnabled?c.borderWidth+'px solid '+c.borderColor:'none'}}>AGORA ESTÁ SE FORMANDO</span></div></div>
    </Panel>
    <Panel label="Formato">
      <Range label="Espaçamento horizontal" value={c.paddingX} min={0} max={100} onChange={paddingX=>set({paddingX})}/><Range label="Espaçamento vertical" value={c.paddingY} min={0} max={100} onChange={paddingY=>set({paddingY})}/><Range label="Distância entre linhas" value={c.lineGap} min={0} max={60} onChange={lineGap=>set({lineGap})}/><Range label="Cantos" value={c.radius} min={0} max={100} onChange={radius=>set({radius})}/>
    </Panel>
    <Panel label="Borda"><Checkbox label="Ativar borda" checked={c.borderEnabled} onChange={e=>set({borderEnabled:e.target.checked})}/>{c.borderEnabled&&<Stack><input className="color" type="color" value={c.borderColor} onChange={e=>set({borderColor:e.target.value})}/><Range label="Espessura" value={c.borderWidth} min={0} max={20} onChange={borderWidth=>set({borderWidth})}/><Range label="Opacidade" value={c.borderOpacity} min={0} max={1} step={.01} onChange={borderOpacity=>set({borderOpacity})}/></Stack>}</Panel>
    <Button block variant={saveFeedback==='saved'?'success':saveFeedback==='error'?'danger':'primary'} disabled={saveFeedback==='saving'} onClick={save}>
      {saveFeedback==='saving'?'Salvando…':saveFeedback==='saved'?'Configuração salva ✓':saveFeedback==='error'?'Tentar salvar novamente':'Salvar configuração'}
    </Button>
    {saveFeedback==='saved'?<Alert variant="success">Configuração salva. Ela será restaurada na próxima abertura.</Alert>:
      saveFeedback==='error'?<Alert variant="error" detail={saveError}>Não foi possível salvar a configuração.</Alert>:
      <Alert variant="info">Salve depois de ajustar. A configuração salva será restaurada quando o SPresenter abrir novamente.</Alert>}
    {!state.target&&<Alert variant="info">Coloque uma música ao vivo. O plugin nunca envia conteúdo ao ar por conta própria.</Alert>}
  </Root>;
}
