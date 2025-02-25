package state

import (
	pb "github.com/hashicorp/waypoint/pkg/server/gen"
	"github.com/hashicorp/waypoint/pkg/serverstate"
)

var releaseOp = &appOperation{
	Struct: (*pb.Release)(nil),
	Bucket: []byte("release"),
}

func init() {
	releaseOp.register()
}

// ReleasePut inserts or updates a release record.
func (s *State) ReleasePut(update bool, b *pb.Release) error {
	return releaseOp.Put(s, update, b)
}

// ReleaseGet gets a release by ref.
func (s *State) ReleaseGet(ref *pb.Ref_Operation) (*pb.Release, error) {
	result, err := releaseOp.Get(s, ref)
	if err != nil {
		return nil, err
	}

	return result.(*pb.Release), nil
}

func (s *State) ReleaseList(
	ref *pb.Ref_Application,
	opts ...serverstate.ListOperationOption,
) ([]*pb.Release, error) {
	raw, err := releaseOp.List(s, serverstate.BuildListOperationOptions(ref, opts...))
	if err != nil {
		return nil, err
	}

	result := make([]*pb.Release, len(raw))
	for i, v := range raw {
		result[i] = v.(*pb.Release)
	}

	return result, nil
}

// ReleaseLatest gets the latest release that was completed successfully.
func (s *State) ReleaseLatest(
	ref *pb.Ref_Application,
	ws *pb.Ref_Workspace,
) (*pb.Release, error) {
	result, err := releaseOp.Latest(s, ref, ws)
	if result == nil || err != nil {
		return nil, err
	}

	return result.(*pb.Release), nil
}
