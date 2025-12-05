import { useState } from "react";

function App() {
	const [nome, setNome] = useState("");
	const [endereco_ip, setEndereco_ip] = useState("");
	const [tipo, setTipo] = useState("");

	function handleRegister(e) {
		e.preventDefault();
		console.log(nome, endereco_ip, tipo);

		fetch("http://localhost:3001/dispositivos", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				nome,
				endereco_ip,
				tipo,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Resposta: ", data);
			})
			.catch((err) => {
				console.log("Erro: ", err);
			});
	}

	return (
		<>
			<div id="header">
				<h1>- Serviço PIMBAnet -</h1>
			</div>
			<div id="pimba-form">
				<h2>Cadastre seu dispositivo e conecte-se à rede</h2>
				<form>
					<label>
						Nome do dispositivo:
						<input
							type="text"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
						/>
					</label>
					<label>
						Enereço de IP:
						<input
							type="text"
							value={endereco_ip}
							onChange={(e) => setEndereco_ip(e.target.value)}
						/>
					</label>
					<label>
						Tipo do dispositivo:
						<input
							type="text"
							value={tipo}
							onChange={(e) => setTipo(e.target.value)}
						/>
					</label>
					<input type="submit" id="submit" onClick={handleRegister} />
				</form>
			</div>
		</>
	);
}

export default App;
