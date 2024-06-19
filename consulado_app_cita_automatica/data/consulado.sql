-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-06-2024 a las 11:09:05
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
  `fecha_cita_res` date NOT NULL,
  `hora_cita_res` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Estructura de tabla para la tabla `dni_res`
--

CREATE TABLE `dni_res` (
  `id_dni_res` int(6) NOT NULL,
  `id_residente` int(6) NOT NULL,
  `fin_dni_res` date NOT NULL,
  `inicio_dni_res` date NOT NULL,
  `num_dni_res` varchar(9) NOT NULL
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
-- Estructura de tabla para la tabla `pasaporte_res`
--

CREATE TABLE `pasaporte_res` (
  `id_pasaporte` int(6) NOT NULL,
  `num_pasaporte_res` varchar(9) NOT NULL,
  `em_pasaporte_res` date NOT NULL,
  `cad_pasaporte_res` date NOT NULL,
  `Id_residente` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `residentes_aire`
--

CREATE TABLE `residentes_aire` (
  `Id_residente` int(6) NOT NULL,
  `consulado_pertenencia` varchar(20) NOT NULL,
  `nombre_res` varchar(25) NOT NULL,
  `apellido_res` varchar(25) NOT NULL,
  `telefono_res` varchar(15) NOT NULL,
  `direccion_res` varchar(20) NOT NULL,
  `ciudad_aire_res` varchar(25) NOT NULL,
  `num_dni_res` varchar(9) NOT NULL,
  `fin_dni_res` date NOT NULL,
  `num_pasaporte_res` varchar(9) NOT NULL,
  `fin_pasaporte_res` varchar(9) NOT NULL,
  `email_res` varchar(15) NOT NULL,
  `password_res` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `dni_res`
--
ALTER TABLE `dni_res`
  ADD PRIMARY KEY (`id_dni_res`);

--
-- Indices de la tabla `no_residentes`
--
ALTER TABLE `no_residentes`
  ADD PRIMARY KEY (`id_no_res`);

--
-- Indices de la tabla `pasaporte_res`
--
ALTER TABLE `pasaporte_res`
  ADD PRIMARY KEY (`id_pasaporte`);

--
-- Indices de la tabla `residentes_aire`
--
ALTER TABLE `residentes_aire`
  ADD PRIMARY KEY (`Id_residente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita_dni_res`
--
ALTER TABLE `cita_dni_res`
  MODIFY `id_cita_res` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cita_urgente`
--
ALTER TABLE `cita_urgente`
  MODIFY `id_cita urgente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `dni_res`
--
ALTER TABLE `dni_res`
  MODIFY `id_dni_res` int(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `no_residentes`
--
ALTER TABLE `no_residentes`
  MODIFY `id_no_res` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pasaporte_res`
--
ALTER TABLE `pasaporte_res`
  MODIFY `id_pasaporte` int(6) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `residentes_aire`
--
ALTER TABLE `residentes_aire`
  MODIFY `Id_residente` int(6) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
