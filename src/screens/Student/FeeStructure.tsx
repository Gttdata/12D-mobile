import { View, Text, SafeAreaView, ScrollView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { apiPost, useSelector } from "../../Modules";
import { Header } from "../../Components";
import { Colors, Sizes } from "../../Modules/Modules";

const FeeStructure = ({ navigation }: any) => {
  const { member } = useSelector((state) => state.member);
  const [feeStructure, setFeeStructure] = useState<any[]>([]);
  const [studentfeedetails, setStudentFeeDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([getFessDetails(), getstudentFessDetails()]);
    } catch (e) {
      console.log("Error fetching fee data:", e);
    } finally {
      setLoading(false);
    }
  };

  const getFessDetails = async () => {
    try {
      const res = await apiPost("api/classFeeMapping/get", {
        filter: `AND CLASS_ID=${member?.CLASS_ID} AND YEAR_ID=${member?.YEAR_ID} AND DIVISION_ID=${member?.DIVISION_ID}`,
      });

      if (res && res.code == 200) {
        setFeeStructure(res.data);
      }
    } catch (error) {
      console.log("Error getFessDetails:", error);
    }
  };

  const getstudentFessDetails = async () => {
    try {
      const res = await apiPost("api/studentFeeDetails/get", {
        filter: `AND CLASS_ID=${member?.CLASS_ID} AND YEAR_ID=${member?.YEAR_ID} AND DIVISION_ID=${member?.DIVISION_ID} AND STUDENT_ID=${member?.ID}`,
      });

      if (res && res.code == 200) {
        setStudentFeeDetails(res.data);
      }
    } catch (error) {
      console.log("Error getstudentFessDetails:", error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header
        label="Fee Structure"
        onBack={() => {
          navigation.goBack();
        }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color={'#0075CB'} />
        </View>
      ) : (
        <ScrollView>
          <View style={{ padding: 16 }}>
            <View style={styles.commonInfo}>
              <Text style={{ marginBottom: Sizes.Base, color: Colors.Black }}>📚  Class: {feeStructure[0]?.CLASS_NAME}</Text>
              <Text style={{ marginBottom: Sizes.Base, color: Colors.Black }}>🏫  Division: {feeStructure[0]?.DIVISION_NAME}</Text>
              <Text style={{ marginBottom: Sizes.Base, color: Colors.Black }}>📅  Year: {feeStructure[0]?.YEAR_NAME}</Text>
              <Text style={{ marginBottom: Sizes.Base, color: Colors.Black }}>🕒  Created: {feeStructure[0]?.CREATED_MODIFIED_DATE.split(' ')[0]}</Text>
            </View>

            {/* <View>
            <Text style={styles.subTitle}>Fee Structure:</Text>

            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headCell]}>Fee Head</Text>
              <Text style={[styles.cell, styles.amountCell]}>Amount</Text>
            </View>

            <FlatList
              data={feeStructure}
              keyExtractor={(item) => item.ID.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cell}>{item.HEAD_NAME.trim()}</Text>
                  <Text style={[styles.cell, styles.amountCell]}>₹{item.AMOUNT}</Text>
                </View>
              )}
            />

            <View style={styles.totalRow}>
              <Text style={[styles.cell, styles.headCell]}>Total</Text>
              <Text style={[styles.cell, styles.amountCell]}>
                ₹{feeStructure.reduce((sum, item) => sum + Number(item.AMOUNT), 0)}
              </Text>
            </View>
          </View> */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.subTitle}>Fee Breakdown:</Text>

              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.headCell]}>Fee Head</Text>
                <Text style={[styles.cell, styles.amountCell]}>Paid Amount</Text>
                <Text style={[styles.cell, styles.amountCell]}>Pending Amount</Text>

              </View>

              <FlatList
                data={studentfeedetails}
                keyExtractor={(item) => item.ID.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.cell}>{item.HEAD_NAME.trim()}</Text>
                    <Text style={[styles.cell, styles.amountCell]}>₹{item.PAID_FEE}</Text>
                    <Text style={[styles.cell, styles.amountCell]}>₹{item.PENDING_FEE}</Text>
                  </View>
                )}
              />

              <View style={styles.totalRow}>
                <Text style={[styles.cell, styles.headCell]}>Total</Text>
                <Text style={[styles.cell, styles.amountCell]}>
                  ₹{studentfeedetails.reduce((sum, item) => sum + Number(item.PAID_FEE), 0)}
                </Text>
                <Text style={[styles.cell, styles.amountCell]}>
                  ₹{studentfeedetails.reduce((sum, item) => sum + Number(item.PENDING_FEE), 0)}
                </Text>

              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    // padding: 16,
    backgroundColor: '#ffffffff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  commonInfo: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.Black
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d0e8ff',
    paddingVertical: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
    color: Colors.Black
  },
  headCell: {
    fontWeight: '600',
    color: Colors.Black
  },
  amountCell: {
    textAlign: 'right',
    color: Colors.Black
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#d0e8ff', paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default FeeStructure;
