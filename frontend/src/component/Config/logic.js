export const isPresentInFavorite = (favorites, restaurant) => {
    if (!Array.isArray(favorites)) {
        return false;
    }
    for (let item of favorites) {
        if (restaurant.id === item.id) {
            return true;
        }
    }
    return false;
}

//isPresentEventInEventDtoFavorites
export const isPresentInEventDtoFavorites = (favorites, event) => {
    for (let item of favorites) {
        if (event.id === item.id) {
            return true;
        }
    }
    return false;
}

// Hàm lấy tọa độ dựa trên địa chỉ
export const getCoordinates = async (address) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        } else {
            console.error(`Geocode error: Address not found for ${address}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ${address}:`, error);
        return null;
    }
}

// Hàm tính khoảng cách giữa hai tọa độ
export const calculateDistance = (sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude) => {
    const EARTH_RADIUS = 6371; // Bán kính trái đất tính bằng km
    const dLat = toRadians(destinationLatitude - sourceLatitude);
    const dLong = toRadians(destinationLongitude - sourceLongitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(sourceLatitude)) * Math.cos(toRadians(destinationLatitude)) *
              Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;
    return distance;
}

const toRadians = (degree) => {
    return degree * (Math.PI / 180);
}

// Hàm tính thời gian dựa trên khoảng cách (giả định mỗi km mất 1 phút)
export const calculateDuration = (distance) => {
    const minutesPerKm = 5; // giả định mỗi km mất 1 phút
    const duration = distance * minutesPerKm;
    return duration;
}

// Hàm tính giá cước
export const calculateFare = (distance) => {
    const baseFare = 5000; // giá cố định
    const farePerKm = 5000; // giá mỗi km
    const totalFare = baseFare + farePerKm * distance; // tính tổng giá = giá cố định + giá mỗi km * số km
    return totalFare;
}