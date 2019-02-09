program TEST;
const small = 0;
   large    =  10;

type  
  Point	      = record  
		   X,Y,Z : integer ;  
		end;	 
   twochoices = 1..2;
   quarterword = 0..255;
   halfword    = 0..65535;
   twohalves   = packed record rh:halfword;
     case twochoices of 1:(lh:halfword);
                        2:(b0:quarterword;b1:quarterword);
     end;
     
var
   m : array[0..3] of Point;
   p : Point;
   t : twohalves ;
   a : array[small..large] of integer;

 procedure writepoint( point :  Point ) ;
begin
   write('(',point.X,' ',point.Y,' ',point.Z,')');
end;

procedure sum(a,b	: Point ; c : Point ) ;
begin
   a.X := b.X + c.X;
   a.Y := b.Y + c.Y;
   a.Z := b.Z + c.Z;   
end;

begin
   t.rh := 17;
   writeln(t.rh);
   t.lh := 1717;
   writeln(t.lh);
   writeln(t.b0);
   writeln(t.b1);      
   t.b0 := t.b0 + 1;
   writeln(t.lh);
   t.b1 := t.b1 + 1;
   writeln(t.lh);
   
   m[0].X := 1;
   m[0].Y := 2;
   m[0].Z := 3;
   p.X := 17;
   p.Y := -20;
   p.Z := 100;
   sum(m[1], m[0], p);
   writepoint(m[1]);
   writeln();
end.
