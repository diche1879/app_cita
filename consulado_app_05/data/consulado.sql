-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-06-2024 a las 11:59:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `consulado`
--
CREATE DATABASE IF NOT EXISTS `consulado` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `consulado`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita_dni_res`
--

CREATE TABLE `cita_dni_res` (
  `id_cita_res` int(10) NOT NULL,
  `id_residente` int(6) NOT NULL,
  `nombre_res` varchar(25) NOT NULL,
  `apellido_res` varchar(25) NOT NULL,
  `fecha_cita_res` datetime NOT NULL,
  `tipo_documento` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cita_dni_res`
--

INSERT INTO `cita_dni_res` (`id_cita_res`, `id_residente`, `nombre_res`, `apellido_res`, `fecha_cita_res`, `tipo_documento`) VALUES
(87, 3, 'Teofilo', 'Patini', '2024-07-15 09:00:00', 'DNI'),
(88, 4, 'Oscar', 'Wilde', '2024-07-15 07:00:00', 'DNI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita_urgente`
--

CREATE TABLE `cita_urgente` (
  `id_cita urgente` int(11) NOT NULL,
  `tipo_ciutadano` varchar(9) NOT NULL,
  `fecha_cita_no_res` date NOT NULL,
  `hora_cita_no_res` varchar(5) NOT NULL,
  `motivo_cita` varchar(10) NOT NULL,
  `n_denuncia` varchar(15) NOT NULL,
  `id_no_res` int(10) NOT NULL,
  `id_residente` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `no_residentes`
--

CREATE TABLE `no_residentes` (
  `id_no_res` int(10) NOT NULL,
  `nombre_no_res` varchar(25) NOT NULL,
  `apellido_no_res` varchar(25) NOT NULL,
  `telefono_no_res` varchar(15) NOT NULL,
  `email_no_res` varchar(20) NOT NULL,
  `password_no_res` varchar(15) NOT NULL,
  `ciudad_origen` varchar(25) NOT NULL,
  `consulado_actual` text NOT NULL,
  `motivo_cita` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `residentes_aire`
--

CREATE TABLE `residentes_aire` (
  `id_residente` int(6) NOT NULL,
  `consulado_pertenencia` varchar(20) NOT NULL,
  `nombre_res` varchar(25) NOT NULL,
  `apellido_res` varchar(25) NOT NULL,
  `telefono_res` varchar(15) NOT NULL,
  `ciudad_aire_res` varchar(25) NOT NULL,
  `num_dni_res` varchar(9) NOT NULL,
  `fin_dni_res` date NOT NULL,
  `num_pasaporte_res` varchar(9) NOT NULL,
  `fin_pasaporte_res` date NOT NULL,
  `email_res` varchar(15) NOT NULL,
  `password_res` varchar(10) NOT NULL,
  `alerta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `residentes_aire`
--

INSERT INTO `residentes_aire` (`id_residente`, `consulado_pertenencia`, `nombre_res`, `apellido_res`, `telefono_res`, `ciudad_aire_res`, `num_dni_res`, `fin_dni_res`, `num_pasaporte_res`, `fin_pasaporte_res`, `email_res`, `password_res`, `alerta`) VALUES
(3, 'Barcelona', 'Teofilo', 'Patini', '342561780', 'Barcelona', 't3452718p', '2024-09-15', 'E23456789', '2024-12-15', 'teo@gmail.com', '1234', 'Tu DNI caducará el 15/9/2024.'),
(4, 'Barcelona', 'Oscar', 'Wilde', '454647857', 'Tarragona', 'E7654321A', '2024-09-15', 'E7654321A', '2024-11-20', 'wilde@gmail.com', '5678', 'Tu DNI caducará el 15/9/2024.');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita_dni_res`
--
ALTER TABLE `cita_dni_res`
  ADD PRIMARY KEY (`id_cita_res`);

--
-- Indices de la tabla `cita_urgente`
--
ALTER TABLE `cita_urgente`
  ADD PRIMARY KEY (`id_cita urgente`);

--
-- Indices de la tabla `no_residentes`
--
ALTER TABLE `no_residentes`
  ADD PRIMARY KEY (`id_no_res`);

--
-- Indices de la tabla `residentes_aire`
--
ALTER TABLE `residentes_aire`
  ADD PRIMARY KEY (`id_residente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita_dni_res`
--
ALTER TABLE `cita_dni_res`
  MODIFY `id_cita_res` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `cita_urgente`
--
ALTER TABLE `cita_urgente`
  MODIFY `id_cita urgente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `no_residentes`
--
ALTER TABLE `no_residentes`
  MODIFY `id_no_res` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `residentes_aire`
--
ALTER TABLE `residentes_aire`
  MODIFY `id_residente` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
