#include <math.h>
#include <cstdint>
#include <vector>
#include <iostream>

using std::vector;
using std::cout;

typedef uint32_t u32;


// Check if the partitions have the same sum.
bool check_sums(const u32 *numbers, u32 size, u32 num_partitions, vector<u32> &asignment) {
  vector<u32> sums(num_partitions, 0);

  for (u32 i = 0; i < size; i++) {
    sums[asignment[i]] += numbers[i];
  }

  u32 sum = sums[0];
  for (u32 i = 1; i < num_partitions; i++) {
    if (sum != sums[i]) return false;
  }

  return true;
}

// Asign numbers to different partitions recursively.
bool partition_rec(const u32 *numbers, u32 size, u32 num_partitions,vector<u32> &asignment, u32 position) {
  // Base case
  if (position == size) {
    return check_sums(numbers, size, num_partitions, asignment);
  }

  for (u32 choice = 0; choice < num_partitions; choice++) {
    asignment[position] = choice;
    if (partition_rec(numbers, size, num_partitions, asignment, position+1)) return true;
  }

  return false;
}


// Check if the numbers can be partitioned into <num_partitions> sets with equal sum.
extern "C" bool partition(u32 *numbers, u32 size, u32 num_partitions) {
  if (num_partitions < 1) return false;
  if (size < num_partitions) return false;

  cout << "C++ Numbers: ";
  for (u32 i = 0; i < size; i++) {
    cout << numbers[i];
    if (i < size-1) {
      cout << ", ";
    }
  }
  cout << std::endl;

  vector<u32> asignment(size, 0);
  return partition_rec(numbers, size, num_partitions, asignment, 0);
}


// Used for debugging, does not not need to be exported.
int main() {
  u32 numbers[]{2, 2, 2};
  auto result = partition(numbers, 3, 3);
  cout << result << "\n";
}