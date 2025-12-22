import React from 'react';
import { View, Image, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const IncidentLocationMap = () => {
    return (
        <View className="flex-1 bg-slate-800 relative">
            <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8GE97LjX0E2YCcgJcn11kQ6of2weCzmAkR4Q5HNmJEvTmyFY_JLtAUMdmlzH3oYbfXG9NlNDGT6IG5BKkd5agtvE6ohXRVqQS8svaXNzmRyzd-4P4mlUb_EaN9HT4ASXBo0UWybrAS9eEdMqPwTfTg412qvTighcjlocIve1QfUr3iA7lDQweGkA-hbhIuDgRecqKPymOjPFbqi3Dv9teXp3zTJOs4i8HoTHR0hnOiHyYVrSjkUSJRLrdZG1-TV-SI236lWCiMk1" }}
                className="w-full h-full opacity-80"
                resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center">
                <View className="w-48 h-48 bg-blue-500/20 rounded-full items-center justify-center animate-pulse border border-blue-500/50">
                    <MaterialIcons name="location-pin" size={48} color="#3b82f6" />
                </View>
            </View>
        </View>
    );
};

export default IncidentLocationMap;
