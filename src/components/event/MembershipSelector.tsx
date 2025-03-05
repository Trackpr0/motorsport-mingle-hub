
import React from "react";

interface MembershipSelectorProps {
  membersOnly: boolean;
  selectedMembership: string | null;
  memberships: { id: string; name: string }[];
  onMembershipChange: (membershipId: string | null) => void;
}

const MembershipSelector = ({
  membersOnly,
  selectedMembership,
  memberships,
  onMembershipChange
}: MembershipSelectorProps) => {
  if (!membersOnly) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <label className="block text-blue-600 font-medium mb-2">Select Membership</label>
      <select 
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
        value={selectedMembership || ''}
        onChange={(e) => onMembershipChange(e.target.value || null)}
      >
        <option value="">Select a membership...</option>
        {memberships.map(membership => (
          <option key={membership.id} value={membership.id}>
            {membership.name}
          </option>
        ))}
      </select>
      {memberships.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          You need to create memberships first. Go to Profile &gt; Manage Memberships.
        </p>
      )}
    </div>
  );
};

export default MembershipSelector;
