/*
 * Copyright (c) 2019 ARTIC Network http://artic.network
 * https://github.com/artic-network/rampart
 *
 * This file is part of RAMPART. RAMPART is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version. RAMPART is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * See the GNU General Public License for more details. You should have received a copy of the GNU General Public License
 * along with RAMPART. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import styled from 'styled-components';
import { version } from '../../../package.json';

const Container = styled.div`
    width: 80%;
    margin: auto;
    font-size: 18px;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    font-weight: 300;
`;

const Footer = () => {
  return (
    <Container>
      {`VisPan v${version} is adapted from `}
      <a href={"https://artic.network/rampart"} target="_blank" rel="noopener noreferrer">Rampart</a>
      {" project"}
      <br />{ "for "}
      <a href={"https://research.pasteur.fr/en/team/environment-and-infectious-risks/"} target="_blank" rel="noopener noreferrer">ERI-CIBU</a>
      { " INSTITUT PASTEUR"}
    </Container>
  )
}

export default Footer;
