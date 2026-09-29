const form=document.getElementById("formDesbotonado");
const tablaPompon=document.getElementById("tablaPompon");
const tablaSpider=document.getElementById("tablaSpider");
const tablaMalla=document.getElementById("tablaMalla");
const tabs=[...document.querySelectorAll(".tab")];
const panels=[...document.querySelectorAll(".tab-panel")];
const desbotonadorInput=document.getElementById("desbotonador");
const btnLimpiarCama=document.getElementById("btnLimpiarCama");
const btnNuevoDesbotonador=document.getElementById("btnNuevoDesbotonador");
const totalCamas=document.getElementById("totalCamas");
const totalTallos=document.getElementById("totalTallos");
const totalHoras=document.getElementById("totalHoras");
const rendimientoAcumulado=document.getElementById("rendimientoAcumulado");
const nombreResumen=document.getElementById("nombreResumen");

let registros=[];

function horasEntre(inicio,fin){
  const [hi,mi]=inicio.split(":").map(Number);
  const [hf,mf]=fin.split(":").map(Number);
  const inicioMin=hi*60+mi;
  let finMin=hf*60+mf;
  if(finMin<inicioMin) finMin+=24*60;
  return (finMin-inicioMin)/60;
}

function calcular(datos){
  const tallosReales=datos.tallosCama-datos.erradicaciones;
  if(tallosReales<0) throw new Error("Las erradicaciones no pueden ser mayores que los tallos de la cama.");
  const tallosPorMedioCuadro=tallosReales/16;
  const tallosDesbotonados=tallosPorMedioCuadro*datos.mediosCuadros;
  const horasTrabajadas=horasEntre(datos.horaInicio,datos.horaFin);
  if(horasTrabajadas<=0) throw new Error("La hora final debe ser diferente de la hora inicial.");
  return {
    tallosReales,
    tallosPorMedioCuadro,
    tallosDesbotonados,
    horasTrabajadas,
    rendimiento:tallosDesbotonados/horasTrabajadas
  };
}

function numero(valor,decimales=1){
  return new Intl.NumberFormat("es-CO",{maximumFractionDigits:decimales}).format(valor);
}

function limpiarCamposCama(){
  document.getElementById("tipoLabor").value="";
  document.getElementById("bloque").value="";
  document.getElementById("cama").value="";
  document.getElementById("tallosCama").value="";
  document.getElementById("erradicaciones").value=0;
  document.getElementById("mediosCuadros").value=16;
  document.getElementById("horaInicio").value="";
  document.getElementById("horaFin").value="";
  document.getElementById("bloque").focus();
}

function renderTablaTipo(tipo,tabla,nombre){
  const filtrados=registros.filter(r=>r.tipoLabor===tipo);

  if(filtrados.length===0){
    tabla.innerHTML='<tr class="empty-row"><td colspan="6">Todavía no hay registros de '+nombre+'.</td></tr>';
    return;
  }

  tabla.innerHTML=filtrados.map(r=>'<tr><td>'+r.bloque+'</td><td>'+r.cama+'</td><td>'+numero(r.mediosCuadros)+'</td><td>'+numero(r.resultado.tallosDesbotonados,2)+'</td><td>'+numero(r.resultado.horasTrabajadas,2)+' h</td><td><strong>'+numero(r.resultado.rendimiento,2)+' tallos/h</strong></td></tr>').join("");
}

function activarTab(tipo){
  tabs.forEach(tab=>{
    const activo=tab.dataset.tab===tipo;
    tab.classList.toggle("active",activo);
    tab.setAttribute("aria-selected",activo ? "true" : "false");
  });

  panels.forEach(panel=>{
    const activo=panel.dataset.panel===tipo;
    panel.classList.toggle("active",activo);
    panel.hidden=!activo;
  });
}

tabs.forEach(tab=>tab.addEventListener("click",()=>activarTab(tab.dataset.tab)));

function render(){
  const nombre=desbotonadorInput.value.trim();
  nombreResumen.textContent=nombre ? "Desbotonador: "+nombre : "Aún no hay desbotonador activo.";

  renderTablaTipo("Desbotón Pompón",tablaPompon,"Desbotón Pompón");
  renderTablaTipo("Desbotón Spider",tablaSpider,"Desbotón Spider");
  renderTablaTipo("Malla",tablaMalla,"Malla");

  if(registros.length===0){
    totalCamas.textContent="0";
    totalTallos.textContent="0";
    totalHoras.textContent="0 h";
    rendimientoAcumulado.textContent="0 tallos/h";
    return;
  }

  const tallos=registros.reduce((s,r)=>s+r.resultado.tallosDesbotonados,0);
  const horas=registros.reduce((s,r)=>s+r.resultado.horasTrabajadas,0);

  totalCamas.textContent=registros.length;
  totalTallos.textContent=numero(tallos,2);
  totalHoras.textContent=numero(horas,2)+" h";
  rendimientoAcumulado.textContent=horas>0 ? numero(tallos/horas,2)+" tallos/h" : "0 tallos/h";
}

form.addEventListener("submit",event=>{
  event.preventDefault();

  const desbotonador=desbotonadorInput.value.trim();
  if(!desbotonador){
    alert("Primero escriba el nombre del desbotonador.");
    desbotonadorInput.focus();
    return;
  }

  const datos={
    tipoLabor:document.getElementById("tipoLabor").value,
    bloque:document.getElementById("bloque").value.trim(),
    cama:document.getElementById("cama").value.trim(),
    tallosCama:Number(document.getElementById("tallosCama").value),
    erradicaciones:Number(document.getElementById("erradicaciones").value),
    mediosCuadros:Number(document.getElementById("mediosCuadros").value),
    horaInicio:document.getElementById("horaInicio").value,
    horaFin:document.getElementById("horaFin").value
  };

  try{
    const resultado=calcular(datos);
    registros.push({...datos,resultado});
    render();
    limpiarCamposCama();
  }catch(error){
    alert(error.message);
  }
});

desbotonadorInput.addEventListener("input",render);
btnLimpiarCama.addEventListener("click",limpiarCamposCama);

btnNuevoDesbotonador.addEventListener("click",()=>{
  if(registros.length>0 && !confirm("¿Desea cerrar este desbotonador e iniciar otro? Se borrarán los registros de esta sesión.")) return;
  registros=[];
  desbotonadorInput.value="";
  limpiarCamposCama();
  render();
  desbotonadorInput.focus();
});

render();