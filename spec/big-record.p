program TEST;

type  
  Point	      = record  
		   X,Y, Z : integer ;  
		end;	 
var
   m : array[0..3] of Point;
   p : Point;
   
procedure writepoint( var point :  Point ) ;
begin
   write('(',point.X,' ',point.Y,' ',point.Z,')');
end;

procedure sum(var a,b,c : Point ) ;
begin
   a.X := b.X + c.X;
   a.Y := b.Y + c.Y;
   a.Z := b.Z + c.Z;   
end;

begin
   m[0].X := 1;
   m[0].Y := 5;
   m[0].Z := 8;   
   p.X := 17;
   p.Y := -20;
   p.Z := 300;

   writepoint(m[1]);
   writeln;
   sum(m[1], m[0], p);
   writepoint(m[0]);
   writeln;   
   writepoint(m[1]);   
   writeln();

   m[0] := m[1];
   sum(m[2], m[0], p);
   sum(m[0], m[2], m[1]);
   writepoint(m[0]);
   writeln();
   writepoint(m[1]);
   writeln();
   writepoint(m[2]);
   writeln();         
end.
