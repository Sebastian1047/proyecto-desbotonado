const form=document.getElementById("formDesbotonado");
const tabla=document.getElementById("tablaRegistros");
const btnLimpiar=document.getElementById("btnLimpiar");
const btnBorrarRegistros=document.getElementById("btnBorrarRegistros");
const salida={tallosReales:document.getElementById("tallosReales"),tallosMedioCuadro:document.getElementById("tallosMedioCuadro"),tallosDesbotonados:document.getElementById("tallosDesbotonados"),rendimiento:document.getElementById("rendimiento")};
let registros=[];

function horasEntre(inicio,fin){
  const [hi,mi]=inicio.split(":").map(Number);
  const [hf,mf]=fin.split(":").map(Number);
  const minutosInicio=hi*60+mi;
  let minutosFin=hf*60+mf;
  if(minutosFin<minutosInicio) minutosFin+=24*60;
  return (minutosFin-minutosInicio)/60;
}

function calcular(datos){
  const tallosReales=datos.tallosCama-datos.erradicaciones;
  if(tallosReales<0) throw new Error("Las erradicaciones no pueden ser mayores que los tallos de la cama.");
  const tallosPorMedioCuadro=tallosReales/16;
  const tallosDesbotonados=tallosPorMedioCuadro*datos.mediosCuadros;
  const horasTrabajadas=horasEntre(datos.horaInicio,datos.horaFin);
  if(horasTrabajadas<=0) throw new Error("La hora final debe ser diferente de la hora inicial.");
  const rendimiento=tallosDesbotonados/horasTrabajadas;
  return {tallosReales,tallosPorMedioCuadro,tallosDesbotonados,horasTrabajadas,rendimiento};
}

function numero(valor,decimales=1){
  return new Intl.NumberFormat("es-CO",{maximumFractionDigits:decimales}).format(valor);
}

function mostrarResultado(r){
  salida.tallosReales.textContent=numero(r.tallosReales);
  salida.tallosMedioCuadro.textContent=numero(r.tallosPorMedioCuadro,2);
  salida.tallosDesbotonados.textContent=numero(r.tallosDesbotonados,2);
  salida.rendimiento.textContent=numero(r.rendimiento,2)+" tallos/h";
}

function renderTabla(){
  if(registros.length===0){
    tabla.innerHTML='<tr class="empty-row"><td colspan="7">Todavía no hay registros.</td></tr>';
    return;
  }
  tabla.innerHTML=registros.map(r=>'<tr><td>'+r.desbotonador+'</td><td>'+r.bloque+'</td><td>'+r.cama+'</td><td>'+numero(r.mediosCuadros)+'</td><td>'+numero(r.resultado.tallosDesbotonados,2)+'</td><td>'+numero(r.resultado.horasTrabajadas,2)+' h</td><td><strong>'+numero(r.resultado.rendimiento,2)+' tallos/h</strong></td></tr>').join("");
}

form.addEventListener("submit",event=>{
  event.preventDefault();
  const datos={
    desbotonador:document.getElementById("desbotonador").value.trim(),
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
    mostrarResultado(resultado);
    registros.unshift({...datos,resultado});
    renderTabla();
  }catch(error){alert(error.message);}
});

btnLimpiar.addEventListener("click",()=>{
  form.reset();
  document.getElementById("erradicaciones").value=0;
  document.getElementById("mediosCuadros").value=16;
});

btnBorrarRegistros.addEventListener("click",()=>{
  registros=[];
  renderTabla();
});