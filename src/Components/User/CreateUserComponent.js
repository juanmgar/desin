import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";

let CreateUserComponent = () => {

    let [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        documentIdentity: '',
        documentNumber: '',
        country: '',
        address: '',
        postalCode: '',
        birthday: ''
    });

    let clickCreate = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let responseBody = await response.json();
            console.log("ok " + responseBody)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (
        <div>
            <h2>Create User</h2>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "email", i.currentTarget.value)
            }} type="text" name="email" placeholder="Email" required/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "password", i.currentTarget.value)
            }} type="password" name="password" placeholder="Contraseña" required/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "name", i.currentTarget.value)
            }} type="text" name="name" placeholder="Nombre"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "surname", i.currentTarget.value)
            }} type="text" name="surname" placeholder="Apellido"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "documentIdentity", i.currentTarget.value)
            }} type="text" name="documentIdentity" placeholder="Tipo de documento"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "documentNumber", i.currentTarget.value)
            }} type="text" name="documentNumber" placeholder="Número de documento"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "country", i.currentTarget.value)
            }} type="text" name="country" placeholder="País"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "address", i.currentTarget.value)
            }} type="text" name="address" placeholder="Dirección"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "postalCode", i.currentTarget.value)
            }} type="text" name="postalCode" placeholder="Código postal"/>
            <input onChange={(i) => {
                modifyStateProperty(formData, setFormData, "birthday", i.currentTarget.value)
            }} type="text" name="birthday" placeholder="Fecha de nacimiento"/>
            <button onClick={clickCreate}>Create User</button>
        </div>
    )
}

export default CreateUserComponent;