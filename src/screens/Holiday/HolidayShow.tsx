import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Header, Icon } from '../../Components';
import { useNavigation } from '@react-navigation/native';
import { apiPost, useSelector } from '../../Modules';
import { Colors } from '../../Modules/Modules';

const HolidayShow: React.FC = () => {
    const { member } = useSelector(state => state.member);
    const navigation = useNavigation();
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true); // Loader state

    useEffect(() => {
        getHoliday();
    }, []);

    const getHoliday = async () => {
        setLoading(true);
        try {
            const res = await apiPost('api/holiday/get', {
                filter: `AND SCHOOL_ID=${member?.SCHOOL_ID} AND STATUS='1'`,
            });

            if (res && res.code == 200) {
                setHolidays(res.data);
            } else {
                setHolidays([]);
            }
        } catch (error) {
            console.log('Error fetching holidays:', error);
            setHolidays([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to convert "YYYY-MM-DD" to "DD-MM-YYYY"
    const formatDate = (isoDate: string) => {
        const [year, month, day] = isoDate.split('-');
        return `${day}-${month}-${year}`;
    };

    const renderHolidayCard = ({ item }: any) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <Icon
                        name="calendar-outline"
                        type="Ionicons"
                        size={28}
                        color={'#1e90ff'}
                        style={{ marginRight: 10 }}
                    />
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.dateText}>{formatDate(item.DATE)}</Text>
                    <Text style={styles.descText}>{item.DESCRIPTION}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header label="Holiday" onBack={() => navigation.goBack()} />

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={'#1e90ff'}
                    style={{ marginTop: 50 }}
                />
            ) : (
                <FlatList
                    data={holidays}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderHolidayCard}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No holidays found</Text>
                    }
                />
            )}
        </View>
    );
};

export default HolidayShow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cardLeft: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardRight: {
        flex: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PrimaryText1,
    },
    descText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
});
