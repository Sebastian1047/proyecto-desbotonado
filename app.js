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
const desbotonadorEnCama=document.getElementById("desbotonadorEnCama");

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
  const horasBrutas=horasEntre(datos.horaInicio,datos.horaFin);
  const horasTrabajadas=horasBrutas-(datos.descuentoTiempo||0);
  if(horasTrabajadas<=0) throw new Error("Las horas laboradas deben ser mayores que cero después de los descuentos.");
  return {
    tallosReales,
    tallosPorMedioCuadro,
    tallosDesbotonados,
    horasBrutas,
    horasTrabajadas,
    rendimiento:tallosDesbotonados/horasTrabajadas
  };
}

function fechaHoy(){
  return new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"2-digit",year:"numeric"}).format(new Date());
}

const datosPrueba=[
  {desbotonador:"Ana López",tipoLabor:"Desbotón Pompón",bloque:"B1",cama:"12",tallosCama:1680,erradicaciones:80,mediosCuadros:16,horaInicio:"07:00",horaFin:"07:45",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Ana López",tipoLabor:"Desbotón Pompón",bloque:"B1",cama:"13",tallosCama:1720,erradicaciones:72,mediosCuadros:16,horaInicio:"07:50",horaFin:"08:35",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Carlos Ruiz",tipoLabor:"Desbotón Pompón",bloque:"B2",cama:"7",tallosCama:1600,erradicaciones:64,mediosCuadros:16,horaInicio:"07:10",horaFin:"07:58",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Carlos Ruiz",tipoLabor:"Desbotón Pompón",bloque:"B2",cama:"8",tallosCama:1540,erradicaciones:60,mediosCuadros:12,horaInicio:"08:05",horaFin:"08:40",descuentoTiempo:0,fecha:"24/09/2026"},

  {desbotonador:"Diana Gómez",tipoLabor:"Desbotón Spider",bloque:"B3",cama:"21",tallosCama:820,erradicaciones:35,mediosCuadros:16,horaInicio:"07:00",horaFin:"08:20",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Diana Gómez",tipoLabor:"Desbotón Spider",bloque:"B3",cama:"22",tallosCama:790,erradicaciones:30,mediosCuadros:10,horaInicio:"08:25",horaFin:"09:15",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Laura Pérez",tipoLabor:"Desbotón Spider",bloque:"B4",cama:"5",tallosCama:860,erradicaciones:42,mediosCuadros:16,horaInicio:"07:15",horaFin:"08:35",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Laura Pérez",tipoLabor:"Desbotón Spider",bloque:"B4",cama:"6",tallosCama:840,erradicaciones:40,mediosCuadros:16,horaInicio:"08:42",horaFin:"10:02",descuentoTiempo:0,fecha:"24/09/2026"},

  {desbotonador:"Ana López",tipoLabor:"Malla",bloque:"B5",cama:"30",tallosCama:1180,erradicaciones:55,mediosCuadros:16,horaInicio:"09:00",horaFin:"10:05",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Ana López",tipoLabor:"Malla",bloque:"B5",cama:"31",tallosCama:1200,erradicaciones:48,mediosCuadros:8,horaInicio:"10:10",horaFin:"10:42",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Miguel Torres",tipoLabor:"Malla",bloque:"B6",cama:"14",tallosCama:1250,erradicaciones:62,mediosCuadros:16,horaInicio:"07:20",horaFin:"08:28",descuentoTiempo:0,fecha:"24/09/2026"},
  {desbotonador:"Miguel Torres",tipoLabor:"Malla",bloque:"B6",cama:"15",tallosCama:1210,erradicaciones:50,mediosCuadros:14,horaInicio:"08:35",horaFin:"09:35",descuentoTiempo:0,fecha:"24/09/2026"}
];

registros=datosPrueba.map(item=>{
  const {desbotonador,...datos}=item;
  return {desbotonador,...datos,resultado:calcular(datos)};
});

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
  document.getElementById("descuentoTiempo").value=0;
  document.getElementById("bloque").focus();
}

function renderTablaTipo(tipo,tabla,nombre){
  const filtrados=registros
    .filter(r=>r.tipoLabor===tipo)
    .sort((a,b)=>a.desbotonador.localeCompare(b.desbotonador,"es"));

  if(filtrados.length===0){
    tabla.innerHTML='<tr class="empty-row"><td colspan="12">Todavía no hay registros de '+nombre+'.</td></tr>';
    return;
  }

  const grupos={};
  filtrados.forEach(r=>{
    if(!grupos[r.desbotonador]) grupos[r.desbotonador]=[];
    grupos[r.desbotonador].push(r);
  });

  let html="";

  Object.entries(grupos).forEach(([colaborador,filas])=>{
    const totalTallos=filas.reduce((s,r)=>s+r.resultado.tallosDesbotonados,0);
    const totalHoras=filas.reduce((s,r)=>s+r.resultado.horasTrabajadas,0);
    const descuentoTotal=filas.reduce((s,r)=>s+(r.descuentoTiempo||0),0);
    const rendimiento=totalHoras>0 ? totalTallos/totalHoras : 0;
    const inicio=filas.map(r=>r.horaInicio).sort()[0];
    const fin=filas.map(r=>r.horaFin).sort().slice(-1)[0];
    const fecha=filas[0].fecha||fechaHoy();

    filas.forEach((r,index)=>{
      html+='<tr class="'+(index===0?'group-start':'')+'">';

      if(index===0){
        const span=filas.length;
        html+='<td rowspan="'+span+'" class="group-cell">'+fecha+'</td>';
        html+='<td rowspan="'+span+'" class="group-cell collaborator-cell"><strong>'+colaborador+'</strong></td>';
        html+='<td rowspan="'+span+'" class="group-cell">'+inicio+'</td>';
        html+='<td rowspan="'+span+'" class="group-cell">'+fin+'</td>';
        html+='<td rowspan="'+span+'" class="group-cell">'+numero(descuentoTotal,2)+'</td>';
        html+='<td rowspan="'+span+'" class="group-cell">'+numero(totalHoras,2)+'</td>';
      }

      html+='<td>'+r.bloque+'</td>';
      html+='<td>'+r.cama+'</td>';
      html+='<td>'+numero(r.resultado.tallosReales,0)+'</td>';
      html+='<td>'+numero(r.resultado.tallosPorMedioCuadro,0)+'</td>';
      html+='<td>'+numero(r.mediosCuadros,1)+'</td>';

      if(index===0){
        html+='<td rowspan="'+filas.length+'" class="group-cell rendimiento-cell"><strong>'+numero(rendimiento,0)+'</strong></td>';
      }

      html+='</tr>';
    });
  });

  tabla.innerHTML=html;
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

  if(nombre){
    desbotonadorEnCama.textContent=nombre;
    desbotonadorEnCama.hidden=false;
  }else{
    desbotonadorEnCama.textContent="";
    desbotonadorEnCama.hidden=true;
  }

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
    horaFin:document.getElementById("horaFin").value,
    descuentoTiempo:Number(document.getElementById("descuentoTiempo").value),
    fecha:fechaHoy()
  };

  try{
    const resultado=calcular(datos);
    registros.push({desbotonador,...datos,resultado});
    render();
    limpiarCamposCama();
  }catch(error){
    alert(error.message);
  }
});

desbotonadorInput.addEventListener("input",render);
btnLimpiarCama.addEventListener("click",limpiarCamposCama);

btnNuevoDesbotonador.addEventListener("click",()=>{
  desbotonadorInput.value="";
  limpiarCamposCama();
  render();
  desbotonadorInput.focus();
});

render();