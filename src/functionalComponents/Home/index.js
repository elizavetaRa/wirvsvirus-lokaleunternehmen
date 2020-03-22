import React from "react";
import Button from "components/CustomButtons/Button.js";

import logo from "assets/img/logo-sticker.png";

const Home = () => (
  <div>
      <div style={{
        maxWidth: '100%',
        background: '#fff',
        borderRadius: '20px', width: '760px'
      }}>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <img src={logo} alt="logo" style={{ width: '200px', maxWidth: "80%"}} />
        <h4>
          Mit <strong>Bleib Lokal!</strong> entwickeln wir eine Lösung,<br />
          um die Läden um die Ecke in dieser schwierigen Zeit zu unterstützen.
        </h4>
        <Button href="/customer/maps" color="info">
          Jetzt lokale Unternehmen finden
        </Button>
      </div>
      </div>
  </div>
)

export default Home