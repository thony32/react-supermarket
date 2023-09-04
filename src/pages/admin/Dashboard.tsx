import { useState, useEffect } from "react";
import axios from "axios";
import { IonToolbar, IonTitle, IonContent, IonPage } from "@ionic/react";
import Chart from "../../assets/Chart";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";

const Dashboard = () => {
  const [depense, setDepense] = useState([]) as any;
  const [montants, setMontants] = useState([]) as any;

  const dataFormatter = (number: any) => {
    return " " + Intl.NumberFormat("us").format(number).toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const a = 2023;
        const responseDepense = await axios.get(
          `http://192.168.43.251:2000/chiffreDepense/${a}`
        );
        setDepense(responseDepense.data);

        const responseMontants = await axios.get(
          `http://192.168.43.251:2000/chiffreMontant/${a}`
        );
        setMontants(responseMontants.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="apple lg:col-span-7  h-full overflow-y-scroll">
      <IonToolbar className="text-2xl lg:text-4xl text-center uppercase">
        <IonTitle className="tracking-widest">
          <div className="titre font-bold flex justify-center gap-4">
            <Chart />
            Tableaux de bord
          </div>
        </IonTitle>
      </IonToolbar>
      <div className="lg:grid lg:grid-cols-2 justify-center flex flex-col gap-4 lg:gap-16 p-8">
        <Card className="w-full bg-gray-600 rounded-lg">
          <Title>Statistique de depense envers les fournisseurs</Title>
          <Subtitle>{/* Add any subtitle you want */}</Subtitle>
          <BarChart
            className="mt-6"
            data={depense.map((item: any) => ({
              name: `idFour ${item.idFour}`,
              "Total Depense": item.totalDepense,
            }))}
            index="name"
            categories={["Total Depense"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
          />
        </Card>

        <Card className="w-full bg-gray-600 rounded-lg">
          <Title>Statistique de vente par mois</Title>
          <Subtitle>{/* Add any subtitle you want */}</Subtitle>
          <BarChart
            className="mt-6"
            data={montants.map((item: any) => ({
              name: `Mois ${item.month}`,
              "Total Montant": item.totalMontant,
            }))}
            index="name"
            categories={["Total Montant"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
