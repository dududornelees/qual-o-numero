import React, { useState, useEffect } from "react";
import Axios from 'axios';

const GlobalContext = React.createContext({});

export const GlobalProvider = (props) => {    
    /*
        Lógica:
        - Crio dois estados, um para caso haja erros e outro para
        armazenar a resposta do servidor (caso não haja erro).

        - Crio uma função para ser chamada sempre que precisar fazer
        uma requisição para o servidor.

        - Defino uma constante para a URL da API.

        - Inicio o Axios (biblioteca para fazer requisições HTTP)
        e defino o metódo "GET", para buscar dados do servidor.

        - Logo após, confiro se há algum erro, caso haja, seto qual o "status"
        do erro e seto esse status no meu estado de "errorExist".

        - Depois, caso haja uma resposta sem erros, seto a resposta do servidor
        no meu estado "randomNumber".

        - Utilizo o Hook useEffect para executar a função para gerar o número
        assim que o componente for montado. Para a aplicação ter um valor inicial.
    */

    const [randomNumber, setRandomNumber] = useState(0);
    const [errorExist, setErrorExist] = useState(false);    

    const fetchRandomNumber = () => {
        const api = 'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300';      

        // Redefinindo estados
        setErrorExist(false);
        setResultado('');
        setGanhou(false);

        Axios.get(api)
            .catch(error => {
                setErrorExist(error.response.status);
            })
            .then(response => {
                if(response) {
                    setErrorExist(false);
                    setRandomNumber(response.data.value);
                }
            });
    }

    // Verificar se o palpite é menor, maior ou certo
    const [numberInput, setNumberInput] = useState(0);
    const [resultado, setResultado] = useState('');
    const [ganhou, setGanhou] = useState(false);

    const submitNumberInput = () => {
        const inputFormatado = parseInt(numberInput);

        if(inputFormatado === randomNumber) {
            setResultado('');
            setGanhou(true);
        } else if (inputFormatado < randomNumber) {            
            setResultado('É menor');
        } else if (inputFormatado > randomNumber) {            
            setResultado('É maior');
        } else {
            alert('Você não digitou um número válido!')
        }
    }
    
    console.log(randomNumber)

    useEffect(() => {
        fetchRandomNumber();
    }, []);


    return(
        <GlobalContext.Provider value={{ fetchRandomNumber, randomNumber, errorExist, setNumberInput, submitNumberInput, resultado, ganhou }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

// Criando um hook do context
export const useGlobal = () => React.useContext(GlobalContext)