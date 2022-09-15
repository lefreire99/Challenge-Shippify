import { Alert } from 'bootstrap'
import React from 'react'
import { Modal, Button, Dropdown, Toast, ToastContainer } from 'react-bootstrap'
import ModalDialog from './components/modal'



function App() {
  const[driverResults,setDriverResults] = React.useState([])
  const[vehiclesResults,setVehiclesResults] = React.useState([])
  const[vehicleId,setVehicleId] = React.useState("")

  React.useEffect(()=>{
    fetch("http://localhost:3001/drivers",{
      method:"GET"
    }).then(res => res.json())
    .catch(error => console.error("Error",error))
    .then(data=>{
      console.log(data)
      setDriverResults(data)
    })
  },[])

  function vehiclesTable(){
    var driver = document.getElementById("selectDriver").value
    var url = "http://localhost:3001/vehicles/driver/"+driver
    console.log(url)
    fetch(url,{
      method:"GET"
    }).then(res => res.json())
    .catch(error => console.error("Error",error))
    .then(data=>{
      console.log(data)
      setVehiclesResults(data)
    })
  }

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); 

  const [showAc, setShowAc] = React.useState(false);
  const handleCloseAc = () => setShowAc(false);
  const handleShowAc = () => setShowAc(true); 

  const [showEl, setShowEl] = React.useState(false);
  const handleCloseEl = () => setShowEl(false);
  const handleShowEl = () => setShowEl(true); 

  const [showTo, setShowTo] = React.useState(false);
  const [message, setMessage] = React.useState("");

  function actualizarVehiculo(){
    console.log(vehicleId)
    var driver = document.getElementById("selectDriver").value
    var driverAc = document.getElementById("driverAc").value
    var driverFinal = driverAc!==""?driverAc:driver
    var url = "http://localhost:3001/vehicles/updvehicle/"+vehicleId
    var matricula = document.getElementById("matriculaAc").value
    var modelo = document.getElementById("modeloAc").value
    var tipo = document.getElementById("tipoAc").value
    var capacidad = document.getElementById("capacidadAc").value
    console.log(url)
    var obj ={driver_id:driverFinal,plate:matricula,model:modelo,type:tipo,capacity:capacidad}

    if(matricula==='' || modelo==='' || tipo==='' || capacidad===''){
      setMessage("Llene todos los campos.")
      setShowTo(true)
      return
    }else{
      fetch(url,{
        method:"POST",
        body: JSON.stringify(obj),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.text())
      .catch(error => console.error("Error",error))
      .then(data=>{
        console.log(data)
        if(data==="ok"){
          setShowAc(false)
          setMessage("Vehículo actualizado.")
          setShowTo(true)
        }
      })
    }

  }

  function eliminarVehiculo(){
    var url = "http://localhost:3001/vehicles/delvehicle/"+vehicleId
    var tabla = document.getElementById("vehicles")
    var fila = document.getElementById(vehicleId)
    console.log(vehicleId)
    fetch(url,{
      method:"DELETE",
    }).then(res => res.text())
    .catch(error => console.error("Error",error))
    .then(data=>{
      console.log(data)
      if(data==="ok"){
        tabla.removeChild(fila)
        setShowEl(false)
        setMessage("Vehículo eliminado.")
        setShowTo(true)
      }
    })
  }

  function crearVehiculo(){
    var driver = document.getElementById("selectDriver").value
    var url = "http://localhost:3001/vehicles/crevehicle"
    var matricula = document.getElementById("matricula").value
    var modelo = document.getElementById("modelo").value
    var tipo = document.getElementById("tipo").value
    var capacidad = document.getElementById("capacidad").value
    console.log(url)
    var obj ={driver_id:driver,plate:matricula,model:modelo,type:tipo,capacity:capacidad}
    console.log(JSON.stringify(obj))
    if(matricula==='' || modelo==='' || tipo==='' || capacidad==='' || driver===''){
      setMessage("Llene todos los campos|Falta conductor.")
      setShowTo(true)
      return
    }else{
      console.log("entro")
      fetch(url,{
        method:"POST",
        body: JSON.stringify(obj),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.text())
      .catch(error => console.error("Error",error))
      .then(data=>{
        console.log(data)
        if(data==="ok"){
          setShow(false)
          setMessage("Vehículo creado.")
          setShowTo(true)
        }
      })
    }
  }

  return (
    <div className='App'>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <label className="navbar-brand">Tabla de vehículos</label>
        </div>
      </nav>  
      <div className="card card-body">
        <div className="container-fluid mb-3">
          <div className="row justify-content-between">
              <div className="col-4">
                  <h2><i className="bi bi-user"></i> Filtro</h2>
              </div>
          </div>
        </div>
        <div className="container-fluid mb-3">
          <div className="d-flex">
              <select className="form-select form-select-sm me-2" id="selectDriver">
                <option value="">Conductor</option>
                {
                  driverResults.map(post =>{
                    return <option key={post.id} value={post.id}>
                      {post.first_name} {post.last_name}
                    </option>
                  })
                }
              </select>    
              <button className="btn btn-secondary me-2" type="button" id="btnSearch" onClick={vehiclesTable}><i className="bi bi-search"></i> Buscar</button>
              <Button className='btn btn-secondary' id="agregar" onClick={handleShow}>Agregar</Button>
          </div>
        </div>
        <div className="mb-3">
          <div className="row justify-content-center">
            <div className="col-12">
              <table className="table mb-3">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Matrícula</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Capacidad</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody id="vehicles">
                {
                  vehiclesResults.map((car,index) =>{
                    return <tr key={car.id} id={car.id}>
                      <th scope="row">{index+1}</th>
                      <td contentEditable={true} suppressContentEditableWarning={true}>{car.plate}</td>
                      <td contentEditable={true} suppressContentEditableWarning={true}>{car.model}</td>
                      <td contentEditable={true} suppressContentEditableWarning={true}>{car.type}</td>
                      <td contentEditable={true} suppressContentEditableWarning={true}>{car.capacity}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle className="btn btn-light" id="dropdown-basic">
                            Ver
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item id="actualizar" onClick={()=>{setShowAc(true);setVehicleId(car.id)}}>Actualizar</Dropdown.Item>
                            <Dropdown.Item id="Eliminar" onClick={()=>{setShowEl(true);setVehicleId(car.id)}}>Eliminar</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Vehículo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="AgregarForm">

              <div className="input-group mb-3">
                <span className="input-group-text" id="matriculaHelp">Matrícula</span>
                <input type="text" className="form-control general" id="matricula" aria-label="matricula" aria-describedby="matriculaHelp" required/>
                <span className="input-group-text" id="modeloHelp">Modelo</span>
                <input type="text" className="form-control general" id="modelo" aria-label="modelo" aria-describedby="modeloHelp" required/>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="tipoHelp">Tipo</span>
                <input type="text" className="form-control general" id="tipo" aria-label="tipo" aria-describedby="tipoHelp" required/>
                <span className="input-group-text" id="capacidadHelp">Capacidad</span>
                <input type="text" className="form-control general" id="capacidad" aria-label="capacidad" aria-describedby="capacidadHelp" required/>
              </div>

            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>Cerrar</Button>
            <Button className="btn btn-secondary" id="Agregar" onClick={crearVehiculo}>Agregar</Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="container mt-3">
        <Modal show={showAc} onHide={handleCloseAc}>
          <Modal.Header closeButton>
            <Modal.Title>Actualizar Vehículo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="ActualizarForm">
              
              <div className="input-group mb-3">
                <span className="input-group-text" id="driverHelpAc">Matrícula</span>
                <select className="form-select form-select-sm me-2" id="driverAc" aria-label="driverAc" aria-describedby="driverHelpAc">
                  <option value="">Conductor</option>
                  {
                    driverResults.map(post =>{
                      return <option key={post.id} value={post.id}>
                        {post.first_name} {post.last_name}
                      </option>
                    })
                  }
                </select>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="matriculaHelpAc">Matrícula</span>
                <input type="text" className="form-control general" id="matriculaAc" aria-label="matriculaAc" aria-describedby="matriculaHelpAc" required/>
                <span className="input-group-text" id="modeloHelpAc">Modelo</span>
                <input type="text" className="form-control general" id="modeloAc" aria-label="modeloAc" aria-describedby="modeloHelpAc" required/>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="tipoHelpAc">Tipo</span>
                <input type="text" className="form-control general" id="tipoAc" aria-label="tipoAc" aria-describedby="tipoHelpAc" required/>
                <span className="input-group-text" id="capacidadHelpAc">Capacidad</span>
                <input type="text" className="form-control general" id="capacidadAc" aria-label="capacidadAc" aria-describedby="capacidadHelpAc" required/>
              </div>

            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseAc}>Cerrar</Button>
            <Button className="btn btn-secondary" id="actualizarAc" onClick={actualizarVehiculo}>Actualizar</Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="container mt-3">
        <Modal show={showEl} onHide={handleCloseEl}>
          <Modal.Header closeButton>
            <Modal.Title>Eliminar Vehículo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Seguro/a de eliminar este vehículo?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseEl}>Cerrar</Button>
            <Button className="btn btn-secondary" id="eliminarEl" onClick={eliminarVehiculo}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
      </div>
      
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowTo(false)} show={showTo} delay={20000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notificación</strong>
            <small className="text-muted">Ahora</small>
          </Toast.Header>
          <Toast.Body id='toast'>{message}</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default App;
