function measureBandWidth() {
    return (navigator.connection.downlink * 1024) / 8 // KB/s
}
