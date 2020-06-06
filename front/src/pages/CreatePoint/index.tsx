import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './styles.css';
import {Link, useHistory} from 'react-router-dom';
import logo from '../../assets/logo.svg';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../service/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
    id: number,
    title: string,
    image_url: string
};

interface IBGEUFResponse{
    sigla: string
}

interface IBGECityResponse{
    nome: string
}

const CreatePoint = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [itens, setItens] = useState<Item[]>([]);
    const [ufs, setUFs] = useState<string[]>([]);
    const [citys, setCitys] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedUF, setSelectedUF] = useState<string>('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedItens, setSelectedItens] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const history = useHistory();

    useEffect(() => {
        api.get('/items').then(
            response => {
                setItens(response.data);
            }
        );
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then( response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUFs(ufInitials);
            // console.log(ufInitials);
        })
    }, []);

    useEffect(() => {
        //carregar as cidades toda x que mudar a UF
        if(selectedUF === '0'){
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then( response => {
            const citysNames = response.data.map(city => city.nome);
            setCitys(citysNames);
            // console.log(ufInitials);
        })

    }, [selectedUF]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setInitialPosition([position.coords.latitude, position.coords.longitude])
        })
    }, []);

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>){
        // console.log(event.target.value);
        const uf = event.target.value;
        setSelectedUF(uf);
    };

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        // console.log(event.target.value);
        const city = event.target.value;
        setSelectedCity(city);
    };

    function handleMapClick(event: LeafletMouseEvent){
        // console.log(event.latlng);
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);  
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        // console.log(event)
        setFormData({...formData, [event.target.name]: event.target.value})
        // console.log(formData);
    }

    function handleSelectedItem(id: number){
        // console.log(id)
        const alreadySelected = selectedItens.findIndex(item => item == id);
        if(alreadySelected >= 0){
            const filteredItens = selectedItens.filter(item => item != id);
            setSelectedItens(filteredItens);
        } else {
            setSelectedItens([...selectedItens, id]);
        }
    }

    async function handleSubmit(event: FormEvent){
        // console.log('aaa');
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItens;

        const data = {
            name,
            email, 
            whatsapp,
            uf,
            city, 
            latitude,
            longitude,
            items
        };

        await api.post('/points', data);

        alert('Ponto de coleta cadastrado!');
        history.push('/');
        // console.log(data);

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                </fieldset>

                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input 
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange} 
                    />
                </div>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email"
                            name="email"
                            id="email" 
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp" 
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>

                        <span>Selecione o endereço no mapa.</span>
                    </legend>
                </fieldset>

                <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} />
                </Map>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUF}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf => (
                                <option value={uf} key={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                            <option value="0">Selecione uma cidade</option>
                            {citys.map(city => (
                                <option value={city} key={city}>{city}</option>
                            ))}  
                        </select>
                    </div>
                </div>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo.</span>
                    </legend>
                </fieldset>

                <ul className="items-grid">
                    {itens.map(item => (
                            <li key={item.id} className={selectedItens.includes(item.id) ? 'selected': ''} onClick={() => handleSelectedItem(item.id)}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))
                    }
                </ul>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;