import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Historico() {
	const [dispositivos, setDispositivos] = useState([]);
	const [testes, setTestes] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function carregar() {
			try {
				const resDispositivos = await fetch(
					"http://localhost:3001/dispositivos",
				);
				const tabelaDispositivos = await resDispositivos.json();

				const resTestes = await fetch("http://localhost:3001/testes");
				const tabelaTestes = await resTestes.json();

				setDispositivos(tabelaDispositivos);
				setTestes(tabelaTestes);
			} catch (err) {
				console.log("Não foi possível carregar as tabelas:", err);
			}
		}

		carregar();
	}, []);

	return (
		<div>
			<h1>Histórico de dispositivos e testes</h1>
			<h2>Dispositivos</h2>
			<table border="1" cellPadding="8" style={{ marginBottom: 30 }}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Nome</th>
						<th>Endereço de IP</th>
						<th>Tipo</th>
					</tr>
				</thead>
				<tbody>
					{dispositivos.map((d) => (
						<tr key={d.id}>
							<td>{d.id}</td>
							<td>{d.nome}</td>
							<td>{d.endereco_ip}</td>
							<td>{d.tipo}</td>
						</tr>
					))}
				</tbody>
			</table>

			<h2>Testes</h2>
			<table border="1" cellPadding="8">
				<thead>
					<tr>
						<th>ID</th>
						<th>ID do Dispositivo</th>
						<th>Estado</th>
						<th>Latência</th>
						<th>Hora da criação</th>
					</tr>
				</thead>
				<tbody>
					{testes.map((t) => (
						<tr key={t.id}>
							<td>{t.id}</td>
							<td>{t.id_dispositivo}</td>
							<td>{t.estado}</td>
							<td>{t.latencia}</td>
							<td>{t.tempo}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button onClick={() => navigate("/")} type="button">
				Cadastrar Dispositivo
			</button>
		</div>
	);
}
