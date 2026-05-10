import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
// Pastikan path import data dummy ini sesuai dengan folder proyek Anda
import { dummyReports } from '../../data/dummyData'; 

export default function ForumScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Daily');
  const [sortBy, setSortBy] = useState('Select');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = ['Daily', 'Weekly', 'Monthly'];
  const filterOptions = ['Select', 'Recent', 'Oldest', 'Popular', 'Solved', 'Unsolved'];

  // Fungsi untuk memfilter dan mengurutkan dummyReports bawaan Anda
  const getProcessedData = () => {
    // Gunakan data dari import proyek Anda
    let filtered = [...dummyReports];

    // Logika Sorting (disesuaikan dengan properti yang umumnya ada)
    if (sortBy === 'Recent') {
      filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    } else if (sortBy === 'Oldest') {
      filtered.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    } else if (sortBy === 'Solved') {
      // Mengasumsikan status 'solved' atau 'selesai' untuk warna hijau
      filtered = filtered.filter(i => i.status === 'solved' || i.status === 'selesai' || i.status === 'proses');
    } else if (sortBy === 'Unsolved') {
      // Mengasumsikan status selain solved untuk warna merah
      filtered = filtered.filter(i => i.status === 'pending' || i.status === 'unsolved');
    }

    return filtered;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER SECTION */}
        <View style={styles.headerBackground}>
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarBig}>
                <Ionicons name="person" size={30} color="#ccc" />
              </View>
              <Text style={styles.headerTitle}>Halo, King!</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="settings" size={34} color="#FFC107" />
            </TouchableOpacity>
          </View>

          {/* TABS ROW */}
          <View style={styles.tabsRow}>
            <Text style={styles.topUpvotedText}>Top Upvoted</Text>
            
            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* MAIN CONTENT AREA */}
        <View style={styles.content}>
          
          {/* SORTING / FILTER */}
          <View style={{ zIndex: 10 }}>
            <View style={styles.sortBox}>
              <Text style={styles.sortLabel}>Sort by :</Text>
              <TouchableOpacity 
                style={styles.sortBtn}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={styles.sortBtnText}>{sortBy}</Text>
                <Ionicons name="caret-down" size={12} color="#fff" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {filterOptions.map(opt => (
                  <TouchableOpacity 
                    key={opt} 
                    style={styles.dropdownItem}
                    onPress={() => { setSortBy(opt); setIsDropdownOpen(false); }}
                  >
                    <Text style={[styles.dropdownItemText, sortBy === opt && {color: '#2A7BBA', fontWeight: 'bold'}]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* LIST LAPORAN KOTAK */}
          <FlatList
            data={getProcessedData()}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#888'}}>Tidak ada data.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.card}
                // Navigasi dikembalikan seperti kode awal Anda
                onPress={() => router.push({ pathname: '/detail-forum', params: { id: item.id } })}
              >
                {/* Bagian Atas Card */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cardAvatar}>
                    <Ionicons name="person" size={24} color="#ccc" />
                  </View>
                  {/* Memanggil variabel nama dari data Anda */}
                  <Text style={styles.cardNama}>{item.nama}</Text>
                  
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={12} color="#888" />
                    {/* Jika di data Anda tidak ada waktu spesifik, ini akan menampilkan 4Y Ago */}
                    <Text style={styles.timeText}>{item.waktu || '4Y Ago'}</Text>
                  </View>
                </View>

                {/* Deskripsi */}
                <Text style={styles.cardDeskripsi} numberOfLines={2}>{item.deskripsi}</Text>

                {/* Bagian Bawah Card */}
                <View style={styles.cardFooter}>
                  {/* Memanggil variabel alamat dari data Anda */}
                  <Text style={styles.cardAlamat} numberOfLines={1}>{item.alamat}</Text>
                  
                  <View style={styles.statsContainer}>
                    <View style={[
                      styles.statusDot, 
                      // Logika warna titik berdasarkan status di data Anda
                      { backgroundColor: (item.status === 'solved' || item.status === 'selesai' || item.status === 'proses') ? '#32CD32' : '#FF0000' }
                    ]} />
                    <Ionicons name="thumbs-up-outline" size={14} color="#000" />
                    {/* Jika tidak ada data upvotes, default ke 1.6k agar UI tetap bagus */}
                    <Text style={styles.upvoteText}>{item.upvotes ? `${(item.upvotes / 1000).toFixed(1)}k` : '1.6k'}</Text>
                  </View>
                </View>

              </TouchableOpacity>
            )}
          />
        </View>

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomNav}>
          <TouchableOpacity><Ionicons name="home" size={28} color="#FFD54F" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="bar-chart" size={28} color="#FFD54F" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="chatbubbles" size={28} color="#FFD54F" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="ticket" size={28} color="#FFD54F" /></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2A7BBA' },
  container: { flex: 1, backgroundColor: '#fff' },
  
  headerBackground: { backgroundColor: '#2A7BBA', paddingTop: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 30 },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBig: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  topUpvotedText: { color: '#fff', fontWeight: 'bold', fontSize: 18, paddingLeft: 25, paddingBottom: 15 },
  tabsContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 25, 
    paddingHorizontal: 20, 
    paddingTop: 15,
    paddingBottom: 10,
    gap: 20 
  },
  tabButton: { paddingBottom: 5 },
  tabButtonActive: { borderBottomWidth: 2, borderBottomColor: '#2A7BBA' },
  tabText: { color: '#333', fontSize: 13, fontWeight: 'bold' },
  tabTextActive: { color: '#2A7BBA' },

  content: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 25, paddingTop: 15 },
  
  sortBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sortLabel: { fontSize: 14, color: '#333', marginRight: 8 },
  sortBtn: { backgroundColor: '#FFD54F', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  sortBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  dropdownMenu: { position: 'absolute', top: 30, left: 60, backgroundColor: '#fff', borderRadius: 8, width: 100, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 12, color: '#333' },

  listContainer: { paddingBottom: 80 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', // Border warna abu-abu kebiruan tipis
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1 
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardNama: { fontWeight: 'bold', fontSize: 14, color: '#2A7BBA' },
  timeContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: 4 },
  timeText: { fontSize: 10, color: '#888' },
  
  cardDeskripsi: { fontSize: 12, color: '#000', fontWeight: '500', lineHeight: 18, marginBottom: 15 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardAlamat: { fontSize: 10, color: '#000', flex: 1, marginRight: 10 },
  statsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  upvoteText: { fontSize: 12, fontWeight: 'bold', color: '#000' },

  bottomNav: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#2A7BBA', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35, paddingVertical: 15 },
});
